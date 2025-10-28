/**
 * Cloudflare Pages Function для получения конфигурации
 * GET /api/get-config?id=demo
 */

export async function onRequestGet(context) {
    try {
        const { request, env } = context;
        const url = new URL(request.url);
        const configId = url.searchParams.get('id');

        if (!configId) {
            return new Response(JSON.stringify({ 
                error: 'Missing id parameter' 
            }), {
                status: 400,
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Санитизация configId
        const sanitizedId = configId.replace(/[^a-zA-Z0-9_-]/g, '');

        // Пробуем загрузить из KV
        if (env.GOOGLE_REVIEWS_CONFIGS) {
            const configData = await env.GOOGLE_REVIEWS_CONFIGS.get(sanitizedId);
            if (configData) {
                return new Response(JSON.stringify({ 
                    success: true,
                    configId: sanitizedId,
                    config: JSON.parse(configData)
                }), {
                    status: 200,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'public, max-age=300'
                    }
                });
            }
        }

        // Если нет в KV, возвращаем 404
        return new Response(JSON.stringify({ 
            success: false,
            error: 'Config not found',
            message: 'Try loading from static file: /configs/' + sanitizedId + '.json'
        }), {
            status: 404,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Error getting config:', error);
        return new Response(JSON.stringify({ 
            success: false,
            error: 'Internal server error',
            details: error.message 
        }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        }
    });
}
