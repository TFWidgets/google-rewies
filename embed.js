(function() {
    'use strict';

    // CSS стили
    const css = `
        .grl { font-family: 'Google Sans', 'Roboto', 'Inter', -apple-system, sans-serif; max-width: 1200px; margin: 20px auto; padding: 0 16px; }
        .grl-widget { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e8eaed; }
        
        .grl-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
        .grl-business { display: flex; gap: 16px; align-items: flex-start; flex: 1; min-width: 300px; }
        .grl-logo { width: 64px; height: 64px; background: linear-gradient(135deg, #4285F4, #34A853); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(66,133,244,0.3); }
        .grl-info h2 { font-size: 1.75em; font-weight: 500; margin: 0 0 8px 0; color: #202124; }
        .grl-info p { color: #5f6368; font-size: 14px; margin: 2px 0; line-height: 1.4; }
        
        .grl-rating { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .grl-score { font-size: 3em; font-weight: 400; color: #202124; margin: 0; line-height: 1; }
        .grl-stars { color: #FBBC04; font-size: 20px; margin: 4px 0; letter-spacing: 2px; }
        .grl-count { color: #5f6368; font-size: 14px; font-weight: 500; }
        .grl-badge { background: #4285F4; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-top: 4px; }
        
        .grl-reviews { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 32px; }
        
        .grl-review { background: #fff; border: 1px solid #e8eaed; border-radius: 12px; padding: 20px; transition: all 0.3s ease; position: relative; }
        .grl-review:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-2px); border-color: #4285F4; }
        .grl-review::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #4285F4, #34A853, #FBBC04, #EA4335); border-radius: 12px 12px 0 0; }
        
        .grl-review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .grl-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #4285F4, #34A853); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 16px; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .grl-reviewer { flex: 1; }
        .grl-reviewer h4 { margin: 0; font-size: 16px; font-weight: 500; color: #202124; }
        .grl-date { font-size: 13px; color: #5f6368; margin: 2px 0 0 0; }
        .grl-guide { background: #e8f0fe; color: #1a73e8; padding: 2px 6px; border-radius: 12px; font-size: 11px; font-weight: 500; margin-top: 4px; display: inline-block; }
        
        .grl-review-stars { color: #FBBC04; font-size: 18px; margin-bottom: 12px; letter-spacing: 1px; }
        .grl-text { color: #202124; font-size: 15px; line-height: 1.6; }
        
        .grl-loading, .grl-error { text-align: center; padding: 60px 20px; color: #5f6368; }
        .grl-spinner { width: 32px; height: 32px; border: 2px solid #e8eaed; border-top: 2px solid #4285F4; border-radius: 50%; animation: grl-spin 1s linear infinite; margin: 0 auto 16px; }
        .grl-error { color: #d93025; }
        
        @keyframes grl-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
            .grl { padding: 0 12px; }
            .grl-widget { padding: 20px; }
            .grl-header { flex-direction: column; }
            .grl-rating { align-items: flex-start; text-align: left; }
            .grl-reviews { grid-template-columns: 1fr; }
        }
    `;

    if (!document.getElementById('grl-styles')) {
        const style = document.createElement('style');
        style.id = 'grl-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    const script = document.currentScript;
    if (!script || script.dataset._mounted) return;
    script.dataset._mounted = '1';

    const clientId = script.dataset.id;
    const theme = script.dataset.theme || 'light';

    if (!clientId) {
        console.error('[GoogleReviewsLive] data-id is required');
        return;
    }

    const container = document.createElement('div');
    container.className = `grl ${theme === 'dark' ? 'grl-dark' : ''}`;
    container.id = `grl-${clientId}-${Date.now()}`;
    script.parentNode.insertBefore(container, script.nextSibling);

    showLoading();
    loadReviews();

    function showLoading() {
        container.innerHTML = `
            <div class="grl-widget">
                <div class="grl-loading">
                    <div class="grl-spinner"></div>
                    <div>Loading reviews from Google...</div>
                </div>
            </div>
        `;
    }

    async function loadReviews() {
        try {
            const apiUrl = `https://google-reviews-live.pages.dev/api/reviews?id=${clientId}`;
            console.log(`[GoogleReviewsLive] Fetching reviews for ${clientId}...`);
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || data.error || 'Failed to load reviews');
            }

            renderWidget(data);
            console.log(`[GoogleReviewsLive] ✅ Loaded ${data.reviews.length} reviews`);

        } catch (error) {
            console.error('[GoogleReviewsLive] Error:', error);
            showError(error.message);
        }
    }

    function showError(message) {
        container.innerHTML = `
            <div class="grl-widget">
                <div class="grl-error">
                    <h3>❌ Failed to load reviews</h3>
                    <p>${escapeHtml(message)}</p>
                    <p style="font-size: 13px; margin-top: 10px;">Need help? Visit <a href="https://tf-widgets.com/support" target="_blank">tf-widgets.com/support</a></p>
                </div>
            </div>
        `;
    }

    function renderWidget(data) {
        const business = data.business;
        const reviews = data.reviews || [];

        const reviewCards = reviews.map((review, index) => {
            const avatarContent = review.profilePhoto ? 
                `<img class="grl-avatar" src="${escapeAttr(review.profilePhoto)}" alt="${escapeAttr(review.author)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" loading="lazy"/>
                 <div class="grl-avatar" style="display:none;">${getInitials(review.author)}</div>` :
                `<div class="grl-avatar">${getInitials(review.author)}</div>`;

            return `
                <div class="grl-review">
                    <div class="grl-review-header">
                        ${avatarContent}
                        <div class="grl-reviewer">
                            <h4>${escapeHtml(review.author)}</h4>
                            <div class="grl-date">${escapeHtml(review.relativeTime || 'Recently')}</div>
                            ${review.isLocalGuide ? '<span class="grl-guide">Local Guide</span>' : ''}
                        </div>
                    </div>
                    <div class="grl-review-stars">${renderStars(review.rating)}</div>
                    <div class="grl-text">${escapeHtml(review.text || '')}</div>
                </div>
            `;
        }).join('');

        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.name)}&query_place_id=${business.placeId}`;

        container.innerHTML = `
            <div class="grl-widget">
                <div class="grl-header">
                    <div class="grl-business">
                        <div class="grl-logo">🌟</div>
                        <div class="grl-info">
                            <h2>${escapeHtml(business.name)}</h2>
                            ${business.address ? `<p>📍 ${escapeHtml(business.address)}</p>` : ''}
                            ${data.cached ? '<p style="color: #34A853;">✓ Reviews updated ' + (new Date(data.cachedAt).toLocaleDateString()) + '</p>' : ''}
                        </div>
                    </div>
                    <div class="grl-rating">
                        <div class="grl-score">${business.rating ? business.rating.toFixed(1) : '0.0'}</div>
                        <div class="grl-stars">${renderStars(business.rating || 0)}</div>
                        <div class="grl-count">${formatNumber(business.totalReviews || 0)} reviews</div>
                        <div class="grl-badge">Google</div>
                    </div>
                </div>
                
                <div class="grl-reviews">${reviewCards}</div>
                
                <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8eaed;">
                    <a href="${escapeAttr(googleMapsUrl)}" 
                       target="_blank" 
                       rel="noopener"
                       style="display: inline-block; background: #4285F4; color: white; text-decoration: none; padding: 12px 24px; border-radius: 24px; font-weight: 500; transition: all 0.3s ease;">
                        View all reviews on Google Maps ↗
                    </a>
                </div>
                
                <div style="text-align: center; margin-top: 16px; color: #5f6368; font-size: 12px;">
                    Powered by <a href="https://tf-widgets.com" target="_blank" style="color: #4285F4; text-decoration: none;">TFWidgets</a>
                    ${data.subscription ? ` • ${data.subscription.plan.charAt(0).toUpperCase() + data.subscription.plan.slice(1)} Plan` : ''}
                </div>
            </div>
        `;
    }

    function renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '<span style="color:#e0e0e0;">' + '★'.repeat(emptyStars) + '</span>';
    }

    function getInitials(name) {
        return (name || 'GU').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return String(text || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
})();
