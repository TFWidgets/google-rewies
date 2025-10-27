(function() {
    'use strict';

    const css = `
        .grw { font-family: 'Google Sans', 'Roboto', 'Inter', -apple-system, sans-serif; max-width: 1200px; margin: 20px auto; padding: 0 16px; }
        .grw-widget { background: #fff; border-radius: 16px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #e8eaed; }
        
        .grw-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 24px; flex-wrap: wrap; }
        .grw-business { display: flex; gap: 16px; align-items: flex-start; flex: 1; min-width: 300px; }
        .grw-logo { width: 64px; height: 64px; background: linear-gradient(135deg, #4285F4, #34A853); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(66,133,244,0.3); }
        .grw-info h2 { font-size: 1.75em; font-weight: 500; margin: 0 0 8px 0; color: #202124; }
        .grw-info p { color: #5f6368; font-size: 14px; margin: 2px 0; line-height: 1.4; }
        .grw-info a { color: #1a73e8; text-decoration: none; }
        .grw-info a:hover { text-decoration: underline; }
        
        .grw-rating { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .grw-score { font-size: 3em; font-weight: 400; color: #202124; margin: 0; line-height: 1; }
        .grw-stars { color: #FBBC04; font-size: 20px; margin: 4px 0; letter-spacing: 2px; }
        .grw-count { color: #5f6368; font-size: 14px; font-weight: 500; }
        .grw-badge { background: #4285F4; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; margin-top: 4px; }
        
        .grw-reviews { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-top: 32px; }
        
        .grw-review { background: #fff; border: 1px solid #e8eaed; border-radius: 12px; padding: 20px; transition: all 0.3s ease; position: relative; height: 100%; }
        .grw-review:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.12); transform: translateY(-2px); border-color: #4285F4; }
        .grw-review::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #4285F4, #34A853, #FBBC04, #EA4335); border-radius: 12px 12px 0 0; }
        
        .grw-review-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .grw-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #4285F4, #34A853); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 16px; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .grw-reviewer { flex: 1; }
        .grw-reviewer h4 { margin: 0; font-size: 16px; font-weight: 500; color: #202124; }
        .grw-date { font-size: 13px; color: #5f6368; margin: 2px 0 0 0; }
        .grw-guide { background: #e8f0fe; color: #1a73e8; padding: 2px 6px; border-radius: 12px; font-size: 11px; font-weight: 500; margin-top: 4px; display: inline-block; }
        
        .grw-review-stars { color: #FBBC04; font-size: 18px; margin-bottom: 12px; letter-spacing: 1px; }
        .grw-text { color: #202124; font-size: 15px; line-height: 1.6; }
        .grw-text.long { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .grw-more { color: #1a73e8; cursor: pointer; font-weight: 500; margin-top: 8px; font-size: 14px; }
        .grw-more:hover { text-decoration: underline; }
        
        .grw-actions { display: flex; justify-content: center; gap: 12px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e8eaed; flex-wrap: wrap; }
        .grw-btn { background: #4285F4; color: white; border: none; border-radius: 24px; padding: 12px 24px; font-weight: 500; font-size: 14px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s ease; }
        .grw-btn:hover { background: #3367D6; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(66,133,244,0.3); }
        .grw-btn-alt { background: #f8f9fa; color: #3c4043; border: 1px solid #dadce0; }
        .grw-btn-alt:hover { background: #f1f3f4; }
        
        .grw-powered { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e8eaed; color: #5f6368; font-size: 13px; }
        
        .grw-loading, .grw-error { text-align: center; padding: 60px 20px; color: #5f6368; }
        .grw-spinner { width: 32px; height: 32px; border: 2px solid #e8eaed; border-top: 2px solid #4285F4; border-radius: 50%; animation: grw-spin 1s linear infinite; margin: 0 auto 16px; }
        .grw-error { color: #d93025; }
        
        @keyframes grw-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
            .grw { padding: 0 12px; }
            .grw-widget { padding: 20px; }
            .grw-header { flex-direction: column; align-items: flex-start; gap: 16px; }
            .grw-rating { align-items: flex-start; text-align: left; }
            .grw-score { font-size: 2.5em; }
            .grw-reviews { grid-template-columns: 1fr; gap: 16px; }
            .grw-actions { flex-direction: column; }
            .grw-btn { width: 100%; justify-content: center; }
        }
        
        .grw-dark { color-scheme: dark; }
        .grw-dark .grw-widget { background: #1f1f1f; color: #e8eaed; border-color: #3c4043; }
        .grw-dark .grw-review { background: #2d2d2d; border-color: #3c4043; color: #e8eaed; }
        .grw-dark .grw-info p { color: #9aa0a6; }
        .grw-dark .grw-date { color: #9aa0a6; }
    `;

    if (!document.getElementById('grw-styles')) {
        const style = document.createElement('style');
        style.id = 'grw-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    const script = document.currentScript;
    if (!script || script.dataset._mounted) return;
    script.dataset._mounted = '1';

    const widgetId = script.dataset.id || 'demo';
    const theme = script.dataset.theme || 'light';

    const container = document.createElement('div');
    container.className = `grw ${theme === 'dark' ? 'grw-dark' : ''}`;
    container.id = `grw-${widgetId}-${Date.now()}`;
    script.parentNode.insertBefore(container, script.nextSibling);

    showLoading();
    loadConfig();

    function showLoading() {
        container.innerHTML = `
            <div class="grw-widget">
                <div class="grw-loading">
                    <div class="grw-spinner"></div>
                    <div>Загружаем отзывы Google...</div>
                </div>
            </div>
        `;
    }

    async function loadConfig() {
        try {
            let config;
            
            if (widgetId === 'local') {
                const localScript = document.querySelector('#grw-local-config');
                if (localScript) {
                    config = JSON.parse(localScript.textContent);
                } else {
                    throw new Error('Локальный конфиг не найден');
                }
            } else {
                const configUrl = `./configs/${widgetId}.json?v=${Date.now()}`;
                const response = await fetch(configUrl);
                if (!response.ok) throw new Error(`Конфиг не найден: ${widgetId}`);
                config = await response.json();
            }
            
            renderWidget(config);
        } catch (error) {
            console.warn('[GoogleReviews] Ошибка загрузки:', error);
            showError(error.message);
        }
    }

    function showError(message) {
        container.innerHTML = `
            <div class="grw-widget">
                <div class="grw-error">
                    <h3>❌ Ошибка загрузки отзывов</h3>
                    <p>${escapeHtml(message)}</p>
                </div>
            </div>
        `;
    }

    function renderWidget(config) {
        const business = config.businessInfo || {};
        const reviews = config.reviews || [];
        const maxReviews = Math.min(reviews.length, config.maxReviews || 5);

        const reviewCards = reviews.slice(0, maxReviews).map((review, index) => {
            const avatarContent = review.avatar ? 
                `<img class="grw-avatar" src="${escapeAttr(review.avatar)}" alt="${escapeAttr(review.author)}" loading="lazy"/>` :
                `<div class="grw-avatar">${getInitials(review.author)}</div>`;

            const isLongText = review.text && review.text.length > 200;
            const textClass = isLongText ? 'grw-text long' : 'grw-text';
            const readMoreId = `grw-text-${container.id}-${index}`;

            return `
                <div class="grw-review">
                    <div class="grw-review-header">
                        ${avatarContent}
                        <div class="grw-reviewer">
                            <h4>${escapeHtml(review.author)}</h4>
                            <div class="grw-date">${escapeHtml(review.date)}</div>
                            ${review.isLocalGuide ? '<span class="grw-guide">Local Guide</span>' : ''}
                        </div>
                    </div>
                    <div class="grw-review-stars">${renderStars(review.rating)}</div>
                    <div id="${readMoreId}" class="${textClass}">${escapeHtml(review.text)}</div>
                    ${isLongText ? `<div class="grw-more" onclick="toggleText('${readMoreId}', this)">Читать полностью</div>` : ''}
                </div>
            `;
        }).join('');

        const googleMapsUrl = business.googleMapsUrl || 'https://www.google.com/maps/search/' + encodeURIComponent(business.name || 'Business');
        const writeReviewUrl = business.writeReviewUrl || googleMapsUrl + '/reviews';

        container.innerHTML = `
            <div class="grw-widget">
                <div class="grw-header">
                    <div class="grw-business">
                        <div class="grw-logo">${escapeHtml(business.emoji || '🏢')}</div>
                        <div class="grw-info">
                            <h2>${escapeHtml(config.widgetTitle || business.name || 'Business Name')}</h2>
                            ${config.widgetDescription ? `<p>${escapeHtml(config.widgetDescription)}</p>` : ''}
                            ${business.address ? `<p>📍 ${escapeHtml(business.address)}</p>` : ''}
                            ${business.phone ? `<p>📞 ${escapeHtml(business.phone)}</p>` : ''}
                            ${business.website ? `<p><a href="${escapeAttr(business.website)}" target="_blank" rel="noopener">🌐 ${business.website.replace(/^https?:\/\//, '')}</a></p>` : ''}
                        </div>
                    </div>
                    <div class="grw-rating">
                        <div class="grw-score">${business.rating ? business.rating.toFixed(1) : '4.8'}</div>
                        <div class="grw-stars">${renderStars(business.rating || 4.8)}</div>
                        <div class="grw-count">${formatNumber(business.totalReviews || reviews.length)} отзывов</div>
                        <div class="grw-badge">Google</div>
                    </div>
                </div>
                
                <div class="grw-reviews">${reviewCards}</div>
                
                ${config.showActions !== false ? `
                <div class="grw-actions">
                    <a class="grw-btn grw-btn-alt" href="${escapeAttr(googleMapsUrl)}" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Смотреть в Google Maps
                    </a>
                    <a class="grw-btn" href="${escapeAttr(writeReviewUrl)}" target="_blank" rel="noopener">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 20h9"/>
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                        </svg>
                        Написать отзыв
                    </a>
                </div>
                ` : ''}
                
                <div class="grw-powered">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>Powered by Google Reviews</span>
                </div>
            </div>
        `;
    }

    window.toggleText = function(textId, button) {
        const textElement = document.getElementById(textId);
        if (textElement.classList.contains('long')) {
            textElement.classList.remove('long');
            button.textContent = 'Свернуть';
        } else {
            textElement.classList.add('long');
            button.textContent = 'Читать полностью';
        }
    };

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
        return String(text || '').replace(/"/g, '&quot;');
    }
})();
