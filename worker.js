export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static assets normally (CSS, JS, images)
    if (url.pathname.includes('.') || url.pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }
    
    // For navigation requests, serve index.html (SPA fallback)
    if (request.headers.get('Sec-Fetch-Mode') === 'navigate') {
      const indexRequest = new Request(new URL('/', request.url), request);
      return env.ASSETS.fetch(indexRequest);
    }
    
    return env.ASSETS.fetch(request);
  }
};
