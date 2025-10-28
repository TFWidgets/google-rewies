export async function onRequestPost(context) {
    const { request, env } = context;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const body = await request.json();
        const { apiKey, email, placeId, businessName, config } = body;

        // Validation
        if (!apiKey) {
            return jsonResponse({ error: 'API key required' }, 400, corsHeaders);
        }

        if (!placeId) {
            return jsonResponse({ error: 'Google Place ID required' }, 400, corsHeaders);
        }

        // Generate client ID from API key (hash)
        const clientId = await hashString(apiKey);

        // Verify API key with Shopify (in production)
        // For now, we'll trust the API key
        const subscription = await verifySubscription(apiKey, env);

        // Create customer config
        const customerData = {
            email: email || '',
            apiKey: apiKey, // In production: encrypt this
            placeId: placeId,
            businessName: businessName || '',
            subscription: subscription,
            widget: {
                maxReviews: config?.maxReviews || 10,
                showPhotos: config?.showPhotos !== false,
                theme: config?.theme || 'light',
                language: config?.language || 'en',
                customColors: config?.customColors || {}
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to KV
        const customerKey = `customers:${clientId}`;
        await env.REVIEWS_CONFIGS?.put(customerKey, JSON.stringify(customerData));

        // Generate embed code
        const embedCode = `<script src="https://google-reviews-live.pages.dev/embed.js" data-id="${clientId}"></script>`;

        return jsonResponse({
            success: true,
            clientId: clientId,
            embedCode: embedCode,
            subscription: subscription,
            message: 'Configuration saved successfully'
        }, 200, corsHeaders);

    } catch (error) {
        console.error('[Admin Setup] Error:', error);
        return jsonResponse({
            error: 'Internal server error',
            message: error.message
        }, 500, corsHeaders);
    }
}

/**
 * Verify subscription with Shopify
 * TODO: Implement real Shopify API check
 */
async function verifySubscription(apiKey, env) {
    // Mock subscription for demo
    // In production: call Shopify API to verify
    
    return {
        plan: 'pro', // starter | pro | enterprise
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        features: {
            maxWidgets: 5,
            maxReviews: 50,
            cacheHours: 6,
            showPhotos: true
        }
    };
}

/**
 * Hash string to create client ID
 */
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 16); // First 16 chars
}

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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}
