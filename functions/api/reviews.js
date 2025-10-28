export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const clientId = url.searchParams.get('id');

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        // Validation
        if (!clientId) {
            return jsonResponse({ error: 'Missing client ID' }, 400, corsHeaders);
        }

        // Get customer config from KV
        const customerKey = `customers:${clientId}`;
        const customerData = await env.REVIEWS_CONFIGS?.get(customerKey);
        
        if (!customerData) {
            return jsonResponse({ 
                error: 'Client not found',
                message: 'Please check your client ID or contact support'
            }, 404, corsHeaders);
        }

        const customer = JSON.parse(customerData);

        // Check subscription status
        if (customer.subscription?.status !== 'active') {
            return jsonResponse({ 
                error: 'Subscription inactive',
                message: 'Please renew your subscription at tf-widgets.com',
                subscription: customer.subscription
            }, 403, corsHeaders);
        }

        // Check if subscription expired
        if (customer.subscription?.expiresAt) {
            const expiresAt = new Date(customer.subscription.expiresAt);
            if (expiresAt < new Date()) {
                return jsonResponse({ 
                    error: 'Subscription expired',
                    message: 'Please renew your subscription at tf-widgets.com',
                    expiresAt: customer.subscription.expiresAt
                }, 403, corsHeaders);
            }
        }

        // Get Place ID
        const placeId = customer.placeId;
        if (!placeId) {
            return jsonResponse({ 
                error: 'Place ID not configured',
                message: 'Please configure your Google Place ID in the admin panel'
            }, 400, corsHeaders);
        }

        // Check cache first
        const cacheKey = `cache:${placeId}`;
        const cachedData = await env.REVIEWS_CACHE?.get(cacheKey);
        
        if (cachedData) {
            const cache = JSON.parse(cachedData);
            const expiresAt = new Date(cache.expiresAt);
            
            // Return cached data if not expired
            if (expiresAt > new Date()) {
                console.log(`[Reviews API] Cache HIT for ${placeId}`);
                return jsonResponse({
                    success: true,
                    cached: true,
                    ...formatResponse(cache, customer)
                }, 200, corsHeaders);
            }
        }

        console.log(`[Reviews API] Cache MISS for ${placeId}, fetching from Google...`);

        // Fetch from Google Places API
        const googleApiKey = env.GOOGLE_PLACES_API_KEY;
        if (!googleApiKey) {
            return jsonResponse({ 
                error: 'Google API not configured',
                message: 'Please contact support'
            }, 500, corsHeaders);
        }

        const reviews = await fetchGoogleReviews(placeId, googleApiKey);

        // Cache the results
        const cacheData = {
            reviews: reviews.reviews,
            rating: reviews.rating,
            totalReviews: reviews.user_ratings_total,
            businessName: reviews.name,
            address: reviews.formatted_address,
            photos: reviews.photos?.slice(0, 10) || [],
            cachedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + getCacheDuration(customer.subscription.plan)).toISOString()
        };

        // Save to cache
        await env.REVIEWS_CACHE?.put(
            cacheKey, 
            JSON.stringify(cacheData),
            { expirationTtl: getCacheDuration(customer.subscription.plan) / 1000 }
        );

        console.log(`[Reviews API] Cached ${reviews.reviews.length} reviews for ${placeId}`);

        return jsonResponse({
            success: true,
            cached: false,
            ...formatResponse(cacheData, customer)
        }, 200, corsHeaders);

    } catch (error) {
        console.error('[Reviews API] Error:', error);
        return jsonResponse({
            error: 'Internal server error',
            message: error.message
        }, 500, corsHeaders);
    }
}

/**
 * Fetch reviews from Google Places API
 */
async function fetchGoogleReviews(placeId, apiKey) {
    // Google Places API - Place Details
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,photos&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    return data.result;
}

/**
 * Format response for client
 */
function formatResponse(cacheData, customer) {
    const maxReviews = customer.widget?.maxReviews || getMaxReviewsByPlan(customer.subscription.plan);
    const showPhotos = customer.widget?.showPhotos !== false && isPremiumPlan(customer.subscription.plan);

    return {
        business: {
            name: cacheData.businessName || customer.businessName || 'Business',
            rating: cacheData.rating || 0,
            totalReviews: cacheData.totalReviews || 0,
            address: cacheData.address || '',
            placeId: customer.placeId
        },
        reviews: (cacheData.reviews || [])
            .slice(0, maxReviews)
            .map(review => ({
                author: review.author_name,
                rating: review.rating,
                text: review.text,
                time: review.time ? new Date(review.time * 1000).toISOString() : null,
                relativeTime: review.relative_time_description,
                profilePhoto: review.profile_photo_url,
                isLocalGuide: review.author_url?.includes('contrib') || false
            })),
        photos: showPhotos ? (cacheData.photos || []).map(photo => ({
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo.photo_reference}&key=${photo.apiKey}`,
            width: photo.width,
            height: photo.height
        })) : [],
        cachedAt: cacheData.cachedAt,
        subscription: {
            plan: customer.subscription.plan,
            features: getPlanFeatures(customer.subscription.plan)
        }
    };
}

/**
 * Get cache duration based on subscription plan
 */
function getCacheDuration(plan) {
    const durations = {
        'starter': 24 * 60 * 60 * 1000,  // 24 hours
        'pro': 6 * 60 * 60 * 1000,       // 6 hours
        'enterprise': 1 * 60 * 60 * 1000 // 1 hour
    };
    return durations[plan] || durations.starter;
}

/**
 * Get max reviews by plan
 */
function getMaxReviewsByPlan(plan) {
    const limits = {
        'starter': 10,
        'pro': 50,
        'enterprise': 999
    };
    return limits[plan] || limits.starter;
}

/**
 * Check if premium plan
 */
function isPremiumPlan(plan) {
    return ['pro', 'enterprise'].includes(plan);
}

/**
 * Get plan features
 */
function getPlanFeatures(plan) {
    const features = {
        'starter': {
            maxReviews: 10,
            cacheHours: 24,
            showPhotos: false,
            customization: 'basic'
        },
        'pro': {
            maxReviews: 50,
            cacheHours: 6,
            showPhotos: true,
            customization: 'full'
        },
        'enterprise': {
            maxReviews: 'unlimited',
            cacheHours: 1,
            showPhotos: true,
            customization: 'white-label'
        }
    };
    return features[plan] || features.starter;
}

/**
 * Helper to create JSON response
 */
function jsonResponse(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data, null, 2), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });
}

// CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}
