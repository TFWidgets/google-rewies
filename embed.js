/*!
 * TF Widgets — Google Reviews v2
 * Встраивание: <script src=".../embed.js" data-id="CLIENT_ID"></script>
 * Конфиг клиента: configs/CLIENT_ID.json (формат v1 с businessInfo/reviews поддерживается)
 * Отзывы клиент вносит сам (копирует свои настоящие отзывы из Google), виджет их красиво показывает
 * и ведёт посетителя на страницу компании в Google: «Написать отзыв» / «Все отзывы».
 * Классы и CSS-переменные: префикс bhw- (общий для всех виджетов TF Widgets), всё ограничено классом .bhw-gr.
 */
(function () {
    'use strict';
    var VERSION = '2.0.0';
    var LOG = '[TFW Reviews]';
    // Где работает живое превью BHWGoogleReviews.render() (конфигуратор на сайте)
    var PREVIEW_DOMAINS = ['tf-widgets.com', '*.tf-widgets.com', '9ac5za-h1.myshopify.com'];

    var I18N = {
        en: { reviews: 'reviews', basedOn: 'Based on {count} reviews on Google', write: 'Write a review', all: 'See all reviews', more: 'Read more', less: 'Show less', guide: 'Local Guide', prev: 'Previous reviews', next: 'Next reviews', close: 'Close', badge: 'Google rating' },
        es: { reviews: 'reseñas', basedOn: 'Basado en {count} reseñas en Google', write: 'Escribir una reseña', all: 'Ver todas las reseñas', more: 'Leer más', less: 'Ver menos', guide: 'Local Guide', prev: 'Anteriores', next: 'Siguientes', close: 'Cerrar', badge: 'Valoración en Google' },
        fr: { reviews: 'avis', basedOn: 'Basé sur {count} avis Google', write: 'Laisser un avis', all: 'Voir tous les avis', more: 'Lire la suite', less: 'Réduire', guide: 'Local Guide', prev: 'Avis précédents', next: 'Avis suivants', close: 'Fermer', badge: 'Note Google' },
        de: { reviews: 'Bewertungen', basedOn: 'Basierend auf {count} Google-Bewertungen', write: 'Bewertung schreiben', all: 'Alle Bewertungen', more: 'Weiterlesen', less: 'Weniger', guide: 'Local Guide', prev: 'Zurück', next: 'Weiter', close: 'Schließen', badge: 'Google-Bewertung' },
        it: { reviews: 'recensioni', basedOn: 'Basato su {count} recensioni Google', write: 'Scrivi una recensione', all: 'Tutte le recensioni', more: 'Leggi tutto', less: 'Mostra meno', guide: 'Local Guide', prev: 'Precedenti', next: 'Successive', close: 'Chiudi', badge: 'Valutazione Google' },
        nl: { reviews: 'reviews', basedOn: 'Op basis van {count} Google-reviews', write: 'Schrijf een review', all: 'Alle reviews bekijken', more: 'Lees meer', less: 'Minder', guide: 'Local Guide', prev: 'Vorige', next: 'Volgende', close: 'Sluiten', badge: 'Google-score' },
        pt: { reviews: 'avaliações', basedOn: 'Com base em {count} avaliações no Google', write: 'Escrever avaliação', all: 'Ver todas as avaliações', more: 'Ler mais', less: 'Ver menos', guide: 'Local Guide', prev: 'Anteriores', next: 'Seguintes', close: 'Fechar', badge: 'Avaliação Google' },
        pl: { reviews: 'opinii', basedOn: 'Na podstawie {count} opinii w Google', write: 'Napisz opinię', all: 'Zobacz wszystkie opinie', more: 'Czytaj dalej', less: 'Zwiń', guide: 'Local Guide', prev: 'Poprzednie', next: 'Następne', close: 'Zamknij', badge: 'Ocena Google' },
        cs: { reviews: 'recenzí', basedOn: 'Na základě {count} recenzí na Googlu', write: 'Napsat recenzi', all: 'Zobrazit všechny recenze', more: 'Číst dál', less: 'Méně', guide: 'Local Guide', prev: 'Předchozí', next: 'Další', close: 'Zavřít', badge: 'Hodnocení Google' },
        sk: { reviews: 'recenzií', basedOn: 'Na základe {count} recenzií na Googli', write: 'Napísať recenziu', all: 'Zobraziť všetky recenzie', more: 'Čítať ďalej', less: 'Menej', guide: 'Local Guide', prev: 'Predchádzajúce', next: 'Ďalšie', close: 'Zavrieť', badge: 'Hodnotenie Google' }
    };

    var ICON = {
        star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z"/></svg>',
        pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 17.3V21h3.7l10.9-10.9-3.7-3.7zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"/></svg>',
        ext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>',
        left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15.4 5.4 8.8 12l6.6 6.6-1.4 1.4-8-8 8-8z"/></svg>',
        right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m8.6 18.6 6.6-6.6-6.6-6.6L10 4l8 8-8 8z"/></svg>',
        close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z"/></svg>',
        quote: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.2 17c-1.6 0-3-1.3-3-3.2 0-3.3 2.2-6.3 5.4-7.8l.8 1.2c-1.8 1-3 2.6-3.2 4.2.3-.1.6-.2 1-.2 1.6 0 2.8 1.2 2.8 2.8S9 17 7.2 17zm9.6 0c-1.6 0-3-1.3-3-3.2 0-3.3 2.2-6.3 5.4-7.8l.8 1.2c-1.8 1-3 2.6-3.2 4.2.3-.1.6-.2 1-.2 1.6 0 2.8 1.2 2.8 2.8S18.6 17 16.8 17z"/></svg>'
    };

    var inlineCSS = `
        .bhw-gr { font-family: var(--bhw-font, 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif); -webkit-font-smoothing: antialiased; box-sizing: border-box; font-size: var(--bhw-font-size, 15px); line-height: 1.5; }
        .bhw-gr *, .bhw-gr *::before, .bhw-gr *::after { box-sizing: border-box; }
        .bhw-gr.bhw-container { width: 100%; max-width: var(--bhw-max-width, 1100px); margin: var(--bhw-margin, 24px auto); }
        .bhw-gr .bhw-widget {
            position: relative; overflow: hidden; isolation: isolate;
            background: var(--bhw-bg, #ffffff); color: var(--bhw-text-color, #111111);
            border: 1px solid var(--bhw-widget-border, rgba(0,0,0,.07)); border-radius: var(--bhw-widget-radius, 22px);
            padding: var(--bhw-padding, 28px); box-shadow: var(--bhw-shadow, 0 24px 60px -28px rgba(0,0,0,.28));
        }
        .bhw-gr.bhw-flat .bhw-widget { background: transparent; border: 0; box-shadow: none; padding: 0; }

        .bhw-gr .bhw-head { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px 24px; margin: 0 0 22px; }
        .bhw-gr .bhw-head-l { display: grid; gap: 4px; min-width: 0; }
        .bhw-gr .bhw-title { margin: 0; padding: 0; font-family: inherit; font-size: var(--bhw-title-size, 1.45em); font-weight: 800; line-height: 1.2; letter-spacing: -.02em; }
        .bhw-gr .bhw-subtitle { margin: 0; opacity: .66; font-size: .95em; }
        .bhw-gr .bhw-summary { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
        .bhw-gr .bhw-score { font-size: 2.6em; font-weight: 800; line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
        .bhw-gr .bhw-sum-txt { display: grid; gap: 3px; }
        .bhw-gr .bhw-count { font-size: .84em; opacity: .66; }
        .bhw-gr .bhw-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .bhw-gr .bhw-btn {
            display: inline-flex; align-items: center; gap: 8px; margin: 0; padding: 11px 16px; min-height: 0; border-radius: var(--bhw-block-radius, 14px);
            font: inherit; font-size: .9em; font-weight: 700; line-height: 1.2; text-decoration: none !important; cursor: pointer; white-space: nowrap;
            background: var(--bhw-accent, #1a73e8); color: var(--bhw-accent-text, #fff); border: 1px solid transparent; box-shadow: none; transition: transform .2s, filter .2s;
        }
        .bhw-gr .bhw-btn:hover { transform: translateY(-1px); filter: brightness(1.06); }
        .bhw-gr .bhw-btn.bhw-ghost { background: transparent; color: inherit; border-color: var(--bhw-card-border, rgba(0,0,0,.12)); }
        .bhw-gr .bhw-btn svg { width: 16px; height: 16px; flex: none; }

        .bhw-gr .bhw-stars { position: relative; display: inline-flex; align-self: flex-start; width: max-content; gap: 1px; line-height: 0; color: var(--bhw-star-empty, rgba(0,0,0,.14)); }
        .bhw-gr .bhw-stars svg { width: var(--bhw-star-size, 18px); height: var(--bhw-star-size, 18px); flex: none; }
        .bhw-gr .bhw-stars-fill { position: absolute; inset: 0 auto 0 0; display: inline-flex; gap: 1px; overflow: hidden; white-space: nowrap; color: var(--bhw-star, #fbbc04); }
        .bhw-gr .bhw-card .bhw-stars { --bhw-star-size: 15px; }

        .bhw-gr .bhw-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, var(--bhw-card-min, 280px)), 1fr)); gap: var(--bhw-gap, 16px); margin: 0; padding: 0; list-style: none; }
        .bhw-gr .bhw-card {
            position: relative; display: flex; flex-direction: column; gap: 12px; margin: 0; padding: 20px;
            background: var(--bhw-card-bg, #f7f7f8); color: var(--bhw-card-text, inherit); border: 1px solid var(--bhw-card-border, rgba(0,0,0,.06));
            border-radius: var(--bhw-block-radius, 14px);
        }
        .bhw-gr .bhw-quote { position: absolute; top: 14px; right: 14px; width: 26px; height: 26px; color: var(--bhw-accent, #1a73e8); opacity: .16; }
        .bhw-gr .bhw-who { display: flex; align-items: center; gap: 11px; min-width: 0; padding-right: 26px; }
        .bhw-gr .bhw-avatar { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; font-weight: 700; font-size: .95em; color: #fff; background: var(--bhw-avatar-bg, #5f6368); object-fit: cover; }
        .bhw-gr .bhw-name { margin: 0; font-weight: 700; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bhw-gr .bhw-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; font-size: .8em; opacity: .62; }
        .bhw-gr .bhw-guide { font-weight: 600; }
        .bhw-gr .bhw-text { margin: 0; white-space: pre-line; overflow-wrap: anywhere; }
        .bhw-gr .bhw-text.bhw-clamp { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(--bhw-lines, 5); overflow: hidden; }
        .bhw-gr .bhw-more { align-self: flex-start; margin: -4px 0 0; padding: 0; min-height: 0; border: 0; background: none; box-shadow: none; font: inherit; font-size: .85em; font-weight: 700; color: var(--bhw-accent, #1a73e8); cursor: pointer; }
        .bhw-gr .bhw-foot { margin: 18px 0 0; font-size: .78em; opacity: .5; text-align: center; }

        /* карусель */
        .bhw-gr.bhw-carousel .bhw-track { display: grid; grid-auto-flow: column; grid-auto-columns: var(--bhw-slide, calc((100% - 2 * var(--bhw-gap, 16px)) / 3)); gap: var(--bhw-gap, 16px); overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none; margin: 0; padding: 2px; list-style: none; }
        .bhw-gr.bhw-carousel .bhw-track::-webkit-scrollbar { display: none; }
        .bhw-gr.bhw-carousel .bhw-card { scroll-snap-align: start; }
        .bhw-gr .bhw-nav { display: flex; gap: 8px; }
        .bhw-gr .bhw-arrow { display: grid; place-items: center; width: 40px; height: 40px; margin: 0; padding: 0; min-height: 0; border-radius: 50%; border: 1px solid var(--bhw-card-border, rgba(0,0,0,.12)); background: var(--bhw-bg, #fff); color: inherit; box-shadow: none; cursor: pointer; }
        .bhw-gr .bhw-arrow svg { width: 20px; height: 20px; }
        .bhw-gr .bhw-arrow[disabled] { opacity: .35; cursor: default; }
        .bhw-gr .bhw-car-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 16px 0 0; }
        .bhw-gr .bhw-dots { display: flex; gap: 6px; }
        .bhw-gr .bhw-dots i { display: block; width: 7px; height: 7px; border-radius: 50%; background: currentColor; opacity: .18; transition: opacity .2s, width .2s; }
        .bhw-gr .bhw-dots i.on { opacity: .75; width: 18px; border-radius: 4px; }
        .bhw-gr.bhw-w-md .bhw-track { --bhw-slide: calc((100% - var(--bhw-gap, 16px)) / 2); }
        .bhw-gr.bhw-w-sm .bhw-track { --bhw-slide: 88%; }

        /* плавающий значок */
        .bhw-gr.bhw-badge { position: fixed; bottom: 20px; z-index: 2147482980; display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
        .bhw-gr.bhw-badge.bhw-pos-right { align-items: flex-end; }
        .bhw-gr.bhw-badge.bhw-inline { position: absolute; }
        .bhw-gr .bhw-pill {
            display: inline-flex; align-items: center; gap: 10px; margin: 0; padding: 10px 16px 10px 12px; min-height: 0; border: 1px solid var(--bhw-widget-border, rgba(0,0,0,.08));
            border-radius: 999px; background: var(--bhw-bg, #fff); color: var(--bhw-text-color, #111); box-shadow: 0 14px 34px -12px rgba(0,0,0,.35); font: inherit; cursor: pointer; text-align: left;
        }
        .bhw-gr .bhw-pill-score { font-size: 1.35em; font-weight: 800; letter-spacing: -.02em; }
        .bhw-gr .bhw-pill-txt { display: grid; gap: 1px; line-height: 1.15; }
        .bhw-gr .bhw-pill-label { font-size: .72em; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; opacity: .6; }
        .bhw-gr .bhw-pill .bhw-stars { --bhw-star-size: 13px; }
        .bhw-gr .bhw-panel { display: none; width: min(380px, calc(100vw - 32px)); max-height: min(560px, calc(100vh - 110px)); overflow: auto; overscroll-behavior: contain; }
        .bhw-gr.bhw-open .bhw-panel { display: block; animation: bhw-gr-pop .3s cubic-bezier(.2,.8,.2,1); }
        .bhw-gr.bhw-badge .bhw-widget { padding: 20px; }
        .bhw-gr.bhw-badge .bhw-head { margin-bottom: 14px; padding-right: 36px; }
        .bhw-gr.bhw-badge .bhw-score { font-size: 2em; }
        .bhw-gr.bhw-badge .bhw-list { grid-template-columns: 1fr; gap: 10px; }
        .bhw-gr.bhw-badge .bhw-card { padding: 16px; }
        .bhw-gr .bhw-x { position: absolute; top: 12px; right: 12px; z-index: 2; display: grid; place-items: center; width: 32px; height: 32px; margin: 0; padding: 0; min-height: 0; border: 0; border-radius: 50%; cursor: pointer; background: color-mix(in srgb, var(--bhw-text-color, #111) 8%, transparent); color: inherit; box-shadow: none; }
        .bhw-gr .bhw-x svg { width: 16px; height: 16px; }
        .bhw-gr.bhw-badge .bhw-actions { margin-top: 14px; }
        .bhw-gr.bhw-badge .bhw-actions .bhw-btn { flex: 1; justify-content: center; }

        .bhw-gr .bhw-btn:focus-visible, .bhw-gr .bhw-arrow:focus-visible, .bhw-gr .bhw-pill:focus-visible, .bhw-gr .bhw-more:focus-visible, .bhw-gr .bhw-x:focus-visible { outline: 2px solid var(--bhw-accent, #1a73e8); outline-offset: 2px; }
        @keyframes bhw-gr-pop { from { opacity: 0; transform: translateY(8px) scale(.97); } to { opacity: 1; transform: none; } }
        @media (max-width: 560px) {
            .bhw-gr .bhw-widget { padding: var(--bhw-padding-mobile, 20px); }
            .bhw-gr.bhw-flat .bhw-widget { padding: 0; }
            .bhw-gr .bhw-score { font-size: 2.2em; }
            .bhw-gr.bhw-badge { bottom: 14px; }
        }
        @media (prefers-reduced-motion: reduce) { .bhw-gr * { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }

        /* защита от тем сайта, которые красят весь текст через color: ... !important */
        .bhw-gr .bhw-widget, .bhw-gr .bhw-pill { color: var(--bhw-text-color, #111) !important; }
        .bhw-gr .bhw-widget :where(*), .bhw-gr .bhw-pill :where(*) { color: inherit !important; }
        .bhw-gr .bhw-card { color: var(--bhw-card-text, var(--bhw-text-color, #111)) !important; }
        .bhw-gr .bhw-widget .bhw-btn:not(.bhw-ghost), .bhw-gr .bhw-widget .bhw-btn:not(.bhw-ghost) * { color: var(--bhw-accent-text, #fff) !important; }
        .bhw-gr .bhw-stars { color: var(--bhw-star-empty, rgba(0,0,0,.14)) !important; }
        .bhw-gr .bhw-stars-fill { color: var(--bhw-star, #fbbc04) !important; }
        .bhw-gr .bhw-widget .bhw-more, .bhw-gr .bhw-widget .bhw-quote { color: var(--bhw-accent, #1a73e8) !important; }
        .bhw-gr .bhw-widget .bhw-avatar { color: #fff !important; }
    `;

    /* =========================================================
       ПУБЛИЧНЫЕ API
       ========================================================= */
    window.BusinessHoursWidgets = window.BusinessHoursWidgets || {};
    window.BusinessHoursWidgets.googleReviews = window.BusinessHoursWidgets.googleReviews || {};

    // Живое превью для конфигуратора: BHWGoogleReviews.render(container, config) -> { update, setState, destroy }
    // setState('open' | 'closed') — для плавающего значка
    var api = window.BHWGoogleReviews = window.BHWGoogleReviews || {};
    api.version = VERSION;
    api.defaults = getDefaultConfig;
    api.checkAccess = bhwCheckAccess;
    api.writeUrl = writeUrl;
    api.render = function (container, config) {
        var noop = { destroy: function () {}, update: function () {}, setState: function () {} };
        if (!bhwCheckAccess({ domains: PREVIEW_DOMAINS }).ok) { console.warn(LOG, 'preview is only available on tf-widgets.com'); return noop; }
        injectBaseStyles();
        if (container._bhwGrDestroy) container._bhwGrDestroy();
        var cls = container.__bhwGrClass || (container.__bhwGrClass = 'bhw-gr-preview-' + Math.random().toString(36).slice(2, 8));
        var widget = null, st = 'open';
        function build(cfg) {
            if (widget) widget.destroy();
            widget = mountWidget(normalizeConfig(cfg || {}), cls, 'preview', { inline: container });
            widget.setState(st);
        }
        build(config);
        var ctrl = {
            update: function (cfg) { build(cfg); },
            setState: function (s) { st = s; if (widget) widget.setState(s); },
            destroy: function () { if (widget) widget.destroy(); widget = null; container._bhwGrDestroy = null; }
        };
        container._bhwGrDestroy = ctrl.destroy;
        return ctrl;
    };

    /* =========================================================
       АВТОЗАПУСК ПО <script data-id="..."> (только свой тег)
       ========================================================= */
    try {
        var currentScript = document.currentScript || (function () {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        if (currentScript && currentScript.dataset && currentScript.dataset.id && currentScript.dataset.bhwMounted !== '1') {
            currentScript.dataset.bhwMounted = '1';
            var debug = currentScript.dataset.debug === '1';
            var clientId = normalizeId(currentScript.dataset.id);
            var baseUrl = getBasePath(currentScript.src);
            loadConfig(clientId, baseUrl)
                .then(function (fetched) {
                    var access = bhwCheckAccess(fetched);
                    if (!access.ok) {
                        console.warn(LOG, 'widget "' + clientId + '" is not active on ' + (location.hostname || 'this page') + ': ' + access.reason);
                        return;
                    }
                    injectBaseStyles();
                    var cfg = normalizeConfig(fetched);
                    if (debug) console.log(LOG, 'config "' + clientId + '":', cfg);
                    var mount = function () {
                        var w = mountWidget(cfg, 'bhw-gr-' + clientId.replace(/[^a-z0-9_-]/gi, '') + '-' + Date.now(), clientId, { anchor: currentScript });
                        window.BusinessHoursWidgets.googleReviews[clientId] = w;
                    };
                    if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
                })
                .catch(function (error) {
                    // Нет конфига = нет виджета
                    console.warn(LOG, 'config "' + clientId + '" not loaded:', error.message);
                });
        }
    } catch (error) {
        console.error(LOG, 'critical error:', error);
    }

    /* =========================================================
       ФУНКЦИИ
       ========================================================= */
    function injectBaseStyles() {
        if (!document.getElementById('google-reviews-widget-styles-v2')) {
            var style = document.createElement('style');
            style.id = 'google-reviews-widget-styles-v2';
            style.textContent = inlineCSS;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    /* ---------------------------------------------------------
       ДОСТУП (общий блок для всех виджетов TF Widgets — копировать без изменений)
       В конфиге клиента:
         "active": true,                       // false = виджет выключен (например, подписка отменена)
         "domains": ["client.com", "client-shop.myshopify.com", "*.client.com"]
       "client.com" разрешает client.com и www.client.com,
       "*.client.com" — любые поддомены (shop.client.com и т.д.).
       Без списка domains виджет не запускается.
       На localhost и при открытии файла с компьютера работает всегда (для тестов).
       --------------------------------------------------------- */
    function bhwCheckAccess(config) {
        config = config || {};
        if (config.active === false) return { ok: false, reason: 'widget is switched off ("active": false)' };
        var host = String(location.hostname || '').toLowerCase().replace(/^www\./, '');
        if (!host || host === 'localhost' || host === '127.0.0.1' || location.protocol === 'file:') return { ok: true };
        var list = config.domains;
        if (typeof list === 'string') list = list.split(/[\s,]+/);
        if (!Array.isArray(list) || !list.length) return { ok: false, reason: 'no "domains" in config' };
        for (var i = 0; i < list.length; i++) {
            var d = String(list[i] || '').trim().toLowerCase()
                .replace(/^[a-z]+:\/\//, '').replace(/[\/:].*$/, '').replace(/^www\./, '');
            if (!d) continue;
            if (d.indexOf('*.') === 0) {
                var base = d.slice(2);
                if (host === base || host.slice(-(base.length + 1)) === '.' + base) return { ok: true };
            } else if (host === d) {
                return { ok: true };
            }
        }
        return { ok: false, reason: 'domain is not in "domains"' };
    }

    function normalizeId(id) { return String(id || 'demo').replace(/\.(json|js)$/i, ''); }
    function getBasePath(src) {
        if (!src) return './';
        try { var url = new URL(src, location.href); return url.origin + url.pathname.replace(/\/[^\/]*$/, '/'); }
        catch (error) { return './'; }
    }
    function loadConfig(clientId, baseUrl) {
        if (clientId === 'local') {
            var el = document.querySelector('#grw-local-config') || document.querySelector('#bhw-local-config');
            if (!el) return Promise.reject(new Error('#grw-local-config not found'));
            try { return Promise.resolve(JSON.parse(el.textContent)); } catch (e) { return Promise.reject(e); }
        }
        var url = baseUrl + 'configs/' + encodeURIComponent(clientId) + '.json?v=' + Date.now();
        return fetch(url, { cache: 'no-store', headers: { 'Accept': 'application/json' } })
            .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    }

    function getDefaultConfig() {
        return {
            layout: 'grid',                 // grid — сетка карточек; carousel — слайдер; badge — плавающий значок с рейтингом
            position: 'left',               // для badge: left | right
            locale: 'en',
            title: 'What our customers say',
            subtitle: '',
            business: {
                name: '',
                rating: 4.8,                // средняя оценка на Google
                totalReviews: 120,          // сколько всего отзывов на Google
                placeId: '',                // Google Place ID — для кнопок «Написать отзыв» и «Все отзывы»
                mapsUrl: ''                 // или ссылка на компанию в Google Maps
            },
            showSummary: true,
            showWriteButton: true,
            showAllButton: true,
            maxReviews: 6,
            textLines: 5,                   // сколько строк отзыва видно до «Read more»
            reviews: [],                    // [{ author, rating, date, text, avatar, localGuide }]
            labels: {},
            style: {
                fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
                colors: {
                    background: '#ffffff',
                    text: '#111111',
                    accent: '#1a73e8',
                    accentText: '#ffffff',
                    star: '#fbbc04',
                    starEmpty: 'rgba(0, 0, 0, 0.14)',
                    cardBackground: '#f7f7f8',
                    cardText: 'inherit',
                    cardBorder: 'rgba(0, 0, 0, 0.06)',
                    widgetBorder: 'rgba(0, 0, 0, 0.07)'
                },
                borderRadius: { widget: 22, blocks: 14 },
                sizes: { fontSize: 1, padding: 28, gap: 16, width: 1100 },
                shadow: { widget: '0 24px 60px -28px rgba(0, 0, 0, 0.28)' },
                transparent: false          // true — без своей подложки, карточки прямо на фоне сайта
            }
        };
    }

    /* v1: { widgetTitle, widgetDescription, businessInfo: {...}, maxReviews, reviews: [{ author, rating, date, text, avatar|profilePhoto, isLocalGuide }] } */
    function normalizeConfig(raw) {
        raw = raw || {};
        var base = getDefaultConfig();
        var legacy = !raw.layout && !!raw.businessInfo;
        if (legacy) {
            var bi = raw.businessInfo || {};
            raw = {
                layout: 'grid',
                title: bi.name || raw.widgetTitle || '',
                subtitle: raw.widgetDescription || '',
                business: { name: bi.name || '', rating: bi.rating, totalReviews: bi.totalReviews, placeId: bi.placeId || '', mapsUrl: bi.googleMapsUrl || '' },
                showWriteButton: !!bi.placeId,
                maxReviews: raw.maxReviews || 6,
                reviews: raw.reviews || [],
                style: {}
            };
        }
        var cfg = mergeDeep(base, raw);
        cfg.reviews = (Array.isArray(raw.reviews) ? raw.reviews : []).filter(function (r) { return r && (r.text || r.author); }).map(function (r) {
            return {
                author: String(r.author || r.name || '').trim(),
                rating: Math.max(1, Math.min(5, Math.round(num(r.rating, 5)))),
                date: String(r.date || r.relativeTime || '').trim(),
                text: String(r.text || '').trim(),
                avatar: safeUrl(r.avatar || r.profilePhoto || ''),
                localGuide: !!(r.localGuide || r.isLocalGuide)
            };
        });
        cfg._t = mergeDeep(I18N[I18N[cfg.locale] ? cfg.locale : 'en'], {});
        var L = raw.labels || {};
        Object.keys(L).forEach(function (k) { if (typeof L[k] === 'string' && L[k]) cfg._t[k] = L[k]; });
        cfg._legacy = legacy;
        return cfg;
    }

    function isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); }
    function mergeDeep(base, over) {
        var out = {};
        Object.keys(base || {}).forEach(function (k) { out[k] = isObj(base[k]) ? mergeDeep(base[k], {}) : base[k]; });
        Object.keys(over || {}).forEach(function (k) {
            var v = over[k];
            if (isObj(v) && isObj(out[k])) out[k] = mergeDeep(out[k], v);
            else if (v !== undefined) out[k] = v;
        });
        return out;
    }
    function cssValue(v, fallback) { if (v === undefined || v === null || v === '') return fallback; return String(v).replace(/[;{}<>]/g, ''); }
    function num(v, fallback) { var n = Number(v); return isFinite(n) && v !== '' && v !== null ? n : fallback; }
    function safeUrl(url) {
        var u = String(url || '').trim();
        if (!u) return '';
        if (/^https?:\/\//i.test(u)) return u;
        if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(u)) return 'https://' + u;
        return '';
    }
    function escapeHtml(text) {
        return String(text == null ? '' : text).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function tpl(s, map) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; }); }
    function fmtCount(n, locale) { try { return new Intl.NumberFormat(locale || 'en').format(n); } catch (e) { return String(n); } }
    function fmtRating(r, locale) { try { return new Intl.NumberFormat(locale || 'en', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(r); } catch (e) { return r.toFixed(1); } }
    function cleanPlaceId(id) { return String(id || '').trim().replace(/[^\w-]/g, ''); }
    function writeUrl(placeId) { var p = cleanPlaceId(placeId); return p ? 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(p) : ''; }
    function allUrl(b) {
        var p = cleanPlaceId(b.placeId);
        if (p) return 'https://search.google.com/local/reviews?placeid=' + encodeURIComponent(p);
        var m = safeUrl(b.mapsUrl);
        return /^https:\/\/([\w-]+\.)*(google\.[a-z.]+|goo\.gl|maps\.app\.goo\.gl)\//i.test(m) ? m : '';
    }
    var AV_COLORS = ['#1a73e8', '#e8710a', '#188038', '#d93025', '#9334e6', '#12848e', '#b06000', '#c5221f'];
    function avatarColor(name) { var h = 0; String(name || '').split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return AV_COLORS[h % AV_COLORS.length]; }
    function initials(name) { var p = String(name || '?').trim().split(/\s+/); return ((p[0] || '?').charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : '')).toUpperCase(); }

    function starsHtml(rating) {
        var r = Math.max(0, Math.min(5, num(rating, 0)));
        var five = ICON.star + ICON.star + ICON.star + ICON.star + ICON.star;
        return '<span class="bhw-stars" role="img" aria-label="' + r.toFixed(1) + ' / 5">' + five +
            '<span class="bhw-stars-fill" style="width:' + (r / 5 * 100).toFixed(1) + '%">' + five + '</span></span>';
    }

    function applyCustomStyles(uniqueClass, cfg) {
        var id = 'bhw-gr-style-' + uniqueClass;
        var el = document.getElementById(id);
        if (!el) { el = document.createElement('style'); el.id = id; (document.head || document.documentElement).appendChild(el); }
        var s = cfg.style || {}, c = s.colors || {}, z = s.sizes || {}, r = s.borderRadius || {}, sh = s.shadow || {};
        var fs = num(z.fontSize, 1), pad = num(z.padding, 28);
        el.textContent = '.' + uniqueClass + '{' +
            '--bhw-font:' + cssValue(s.fontFamily, "'Inter', system-ui, sans-serif") + ';' +
            '--bhw-font-size:' + (15 * fs).toFixed(2) + 'px;' +
            '--bhw-max-width:' + Math.round(num(z.width, 1100)) + 'px;' +
            '--bhw-bg:' + cssValue(c.background, '#ffffff') + ';' +
            '--bhw-text-color:' + cssValue(c.text, '#111111') + ';' +
            '--bhw-accent:' + cssValue(c.accent, '#1a73e8') + ';' +
            '--bhw-accent-text:' + cssValue(c.accentText, '#ffffff') + ';' +
            '--bhw-star:' + cssValue(c.star, '#fbbc04') + ';' +
            '--bhw-star-empty:' + cssValue(c.starEmpty, 'rgba(0,0,0,0.14)') + ';' +
            '--bhw-card-bg:' + cssValue(c.cardBackground, '#f7f7f8') + ';' +
            '--bhw-card-text:' + cssValue(c.cardText, 'inherit') + ';' +
            '--bhw-card-border:' + cssValue(c.cardBorder, 'rgba(0,0,0,0.06)') + ';' +
            '--bhw-widget-border:' + cssValue(c.widgetBorder, 'rgba(0,0,0,0.07)') + ';' +
            '--bhw-widget-radius:' + num(r.widget, 22) + 'px;' +
            '--bhw-block-radius:' + num(r.blocks, 14) + 'px;' +
            '--bhw-padding:' + pad + 'px;' +
            '--bhw-padding-mobile:' + Math.round(pad * .72) + 'px;' +
            '--bhw-gap:' + num(z.gap, 16) + 'px;' +
            '--bhw-lines:' + Math.max(2, Math.min(12, Math.round(num(cfg.textLines, 5)))) + ';' +
            '--bhw-shadow:' + cssValue(sh.widget, '0 24px 60px -28px rgba(0,0,0,0.28)') + ';' +
            '}';
        return id;
    }

    function cardHtml(r, cfg) {
        var av = r.avatar
            ? '<img class="bhw-avatar" src="' + escapeHtml(r.avatar) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
            : '<span class="bhw-avatar" aria-hidden="true" style="background:' + avatarColor(r.author) + '">' + escapeHtml(initials(r.author)) + '</span>';
        return '<li class="bhw-card">' + ICON.quote.replace('<svg', '<svg class="bhw-quote"') +
            '<div class="bhw-who">' + av + '<div style="min-width:0"><p class="bhw-name">' + escapeHtml(r.author || '—') + '</p>' +
                '<div class="bhw-meta">' + (r.localGuide ? '<span class="bhw-guide">' + escapeHtml(cfg._t.guide) + '</span>' : '') + (r.date ? '<span>' + escapeHtml(r.date) + '</span>' : '') + '</div></div></div>' +
            starsHtml(r.rating) +
            (r.text ? '<p class="bhw-text bhw-clamp">' + escapeHtml(r.text) + '</p><button class="bhw-more" type="button" hidden>' + escapeHtml(cfg._t.more) + '</button>' : '') +
        '</li>';
    }
    function headHtml(cfg, withClose) {
        var b = cfg.business || {}, T = cfg._t;
        var rating = Math.max(0, Math.min(5, num(b.rating, 0))), total = Math.max(0, Math.round(num(b.totalReviews, 0)));
        var w = cfg.showWriteButton ? writeUrl(b.placeId) : '', a = cfg.showAllButton ? allUrl(b) : '';
        var summary = cfg.showSummary && rating > 0
            ? '<div class="bhw-summary"><span class="bhw-score">' + fmtRating(rating, cfg.locale) + '</span><span class="bhw-sum-txt">' + starsHtml(rating) +
              (total ? '<span class="bhw-count">' + escapeHtml(tpl(T.basedOn, { count: fmtCount(total, cfg.locale) })) + '</span>' : '') + '</span></div>' : '';
        var actions = (w ? '<a class="bhw-btn" href="' + escapeHtml(w) + '" target="_blank" rel="noopener">' + ICON.pen + '<span>' + escapeHtml(T.write) + '</span></a>' : '') +
            (a ? '<a class="bhw-btn bhw-ghost" href="' + escapeHtml(a) + '" target="_blank" rel="noopener"><span>' + escapeHtml(T.all) + '</span>' + ICON.ext + '</a>' : '');
        return {
            head: '<div class="bhw-head"><div class="bhw-head-l">' +
                (cfg.title ? '<h3 class="bhw-title">' + escapeHtml(cfg.title) + '</h3>' : '') +
                (cfg.subtitle ? '<p class="bhw-subtitle">' + escapeHtml(cfg.subtitle) + '</p>' : '') +
                summary + '</div>' + (withClose ? '' : (actions ? '<div class="bhw-actions">' + actions + '</div>' : '')) + '</div>',
            actions: actions
        };
    }

    function mountWidget(cfg, uniqueClass, id, opts) {
        opts = opts || {};
        var inline = opts.inline || null;
        var styleId = applyCustomStyles(uniqueClass, cfg);
        var layout = ['grid', 'carousel', 'badge'].indexOf(cfg.layout) >= 0 ? cfg.layout : 'grid';
        var reviews = cfg.reviews.slice(0, Math.max(1, Math.min(24, Math.round(num(cfg.maxReviews, 6)))));
        var root = document.createElement('div');
        root.id = 'google-reviews-widget-' + id;
        var flat = cfg.style && cfg.style.transparent && layout !== 'badge';
        root.className = 'bhw-gr ' + uniqueClass + (layout === 'badge'
            ? ' bhw-badge bhw-pos-' + (cfg.position === 'right' ? 'right' : 'left') + (inline ? ' bhw-inline' : '')
            : ' bhw-container' + (layout === 'carousel' ? ' bhw-carousel' : '') + (flat ? ' bhw-flat' : ''));
        var cards = reviews.map(function (r) { return cardHtml(r, cfg); }).join('');
        var T = cfg._t, b = cfg.business || {};

        if (layout === 'badge') {
            var h = headHtml(cfg, true), rating = Math.max(0, Math.min(5, num(b.rating, 0)));
            root.style[cfg.position === 'right' ? 'right' : 'left'] = '20px';
            root.innerHTML =
                '<div class="bhw-panel" role="dialog" aria-label="' + escapeHtml(cfg.title || T.badge) + '"><div class="bhw-widget">' +
                    '<button class="bhw-x" type="button" aria-label="' + escapeHtml(T.close) + '">' + ICON.close + '</button>' +
                    h.head + '<ul class="bhw-list">' + cards + '</ul>' + (h.actions ? '<div class="bhw-actions">' + h.actions + '</div>' : '') +
                '</div></div>' +
                '<button class="bhw-pill" type="button" aria-expanded="false">' +
                    '<span class="bhw-pill-score">' + fmtRating(rating, cfg.locale) + '</span>' +
                    '<span class="bhw-pill-txt"><span class="bhw-pill-label">' + escapeHtml(T.badge) + '</span>' + starsHtml(rating) + '</span>' +
                '</button>';
        } else if (layout === 'carousel') {
            var hc = headHtml(cfg, false);
            root.innerHTML = '<div class="bhw-widget">' + hc.head +
                '<ul class="bhw-track">' + cards + '</ul>' +
                '<div class="bhw-car-foot"><div class="bhw-dots" aria-hidden="true"></div><div class="bhw-nav">' +
                    '<button class="bhw-arrow bhw-prev" type="button" aria-label="' + escapeHtml(T.prev) + '">' + ICON.left + '</button>' +
                    '<button class="bhw-arrow bhw-next" type="button" aria-label="' + escapeHtml(T.next) + '">' + ICON.right + '</button>' +
                '</div></div></div>';
        } else {
            var hg = headHtml(cfg, false);
            root.innerHTML = '<div class="bhw-widget">' + hg.head + '<ul class="bhw-list">' + cards + '</ul></div>';
        }

        if (inline) inline.appendChild(root);
        else if (layout === 'badge') document.body.appendChild(root);
        else if (opts.anchor && opts.anchor.parentNode) opts.anchor.parentNode.insertBefore(root, opts.anchor.nextSibling);
        else document.body.appendChild(root);

        var cleanups = [];
        function on(t, e, h2, o) { if (!t) return; t.addEventListener(e, h2, o); cleanups.push(function () { t.removeEventListener(e, h2, o); }); }

        /* «Read more» только там, где текст действительно обрезан */
        function checkClamp() {
            root.querySelectorAll('.bhw-text').forEach(function (p) {
                var btn = p.nextElementSibling; if (!btn || !btn.classList.contains('bhw-more')) return;
                if (!p.classList.contains('bhw-clamp')) return;
                btn.hidden = !(p.scrollHeight > p.clientHeight + 2);
            });
        }
        on(root, 'click', function (e) {
            var m = e.target.closest('.bhw-more'); if (!m) return;
            var p = m.previousElementSibling, open = p.classList.toggle('bhw-clamp');
            m.textContent = open ? T.more : T.less;
            if (typeof widget.onResize === 'function') widget.onResize();
        });

        /* ширина: карусель показывает 3 / 2 / 1 карточку */
        var ro = null;
        function sizeClass() {
            var w = root.clientWidth || 0;
            root.classList.toggle('bhw-w-md', w > 0 && w < 860 && w >= 560);
            root.classList.toggle('bhw-w-sm', w > 0 && w < 560);
            checkClamp(); updateNav();
        }
        var track = root.querySelector('.bhw-track');
        function updateNav() {
            if (!track) return;
            var prev = root.querySelector('.bhw-prev'), next = root.querySelector('.bhw-next'), dots = root.querySelector('.bhw-dots');
            var max = track.scrollWidth - track.clientWidth;
            prev.disabled = track.scrollLeft <= 2; next.disabled = track.scrollLeft >= max - 2;
            var card = track.querySelector('.bhw-card'); if (!card) return;
            var step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 16);
            var pages = Math.max(1, Math.round(max / step) + 1), cur = Math.min(pages - 1, Math.round(track.scrollLeft / step));
            if (dots.children.length !== pages) dots.innerHTML = new Array(pages + 1).join('<i></i>');
            [].forEach.call(dots.children, function (d, i) { d.classList.toggle('on', i === cur); });
            root.querySelector('.bhw-nav').style.visibility = max > 2 ? '' : 'hidden';
        }
        if (track) {
            var go = function (dir) { var card = track.querySelector('.bhw-card'); if (card) track.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' }); };
            on(root.querySelector('.bhw-prev'), 'click', function () { go(-1); });
            on(root.querySelector('.bhw-next'), 'click', function () { go(1); });
            on(track, 'scroll', function () { cancelAnimationFrame(updateNav._r); updateNav._r = requestAnimationFrame(updateNav); }, { passive: true });
        }
        if (window.ResizeObserver) { ro = new ResizeObserver(sizeClass); ro.observe(root); cleanups.push(function () { ro.disconnect(); }); }
        else { on(window, 'resize', sizeClass); }
        requestAnimationFrame(sizeClass);
        root.querySelectorAll('img.bhw-avatar').forEach(function (img) {
            on(img, 'error', function () {
                var r = reviews[[].indexOf.call(root.querySelectorAll('.bhw-card'), img.closest('.bhw-card'))] || {};
                var s = document.createElement('span'); s.className = 'bhw-avatar'; s.style.background = avatarColor(r.author); s.textContent = initials(r.author);
                img.replaceWith(s);
            });
        });

        var widget = {
            root: root, config: cfg, id: id,
            open: function () { root.classList.add('bhw-open'); var p = root.querySelector('.bhw-pill'); if (p) p.setAttribute('aria-expanded', 'true'); requestAnimationFrame(checkClamp); },
            close: function () { root.classList.remove('bhw-open'); var p = root.querySelector('.bhw-pill'); if (p) p.setAttribute('aria-expanded', 'false'); },
            setState: function (st) { if (layout !== 'badge') return; if (st === 'open') this.open(); else this.close(); },
            destroy: function () { cleanups.forEach(function (f) { try { f(); } catch (e) {} }); root.remove(); var s = document.getElementById(styleId); if (s) s.remove(); }
        };
        if (layout === 'badge') {
            var pill = root.querySelector('.bhw-pill');
            on(pill, 'click', function () { root.classList.contains('bhw-open') ? widget.close() : widget.open(); });
            on(root.querySelector('.bhw-x'), 'click', function () { widget.close(); pill.focus(); });
            if (!inline) on(document, 'keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('bhw-open')) { widget.close(); pill.focus(); } });
        }
        return widget;
    }
})();
