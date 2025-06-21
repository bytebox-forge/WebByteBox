// Service Worker for Byte Box - Cyberpunk Caching Strategy
const CACHE_NAME = 'bytebox-v1.0';
const STATIC_CACHE = 'bytebox-static-v1.0';
const DYNAMIC_CACHE = 'bytebox-dynamic-v1.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/WebByteBox/',
    '/WebByteBox/index.html',
    '/WebByteBox/about.html',
    '/WebByteBox/projects.html',
    '/WebByteBox/archives.html',
    '/WebByteBox/assets/css/main.css',
    '/WebByteBox/assets/js/matrix-clean.js',
    '/WebByteBox/assets/js/palette-selector.js',
    '/WebByteBox/assets/js/accessibility.js',
    '/WebByteBox/assets/js/performance.js',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap'
];

// Network-first strategy for dynamic content
const DYNAMIC_ASSETS = [
    '/WebByteBox/lab-logs/',
    '/WebByteBox/modules/',
    '/WebByteBox/payloads/',
    '/WebByteBox/community.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with fallback strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;
    
    // Skip external requests (except fonts)
    if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com')) {
        return;
    }
    
    event.respondWith(
        handleRequest(request)
    );
});

async function handleRequest(request) {
    const url = new URL(request.url);
    
    try {
        // Strategy 1: Cache first for static assets
        if (isStaticAsset(url.pathname)) {
            return await cacheFirst(request);
        }
        
        // Strategy 2: Network first for dynamic content
        if (isDynamicAsset(url.pathname)) {
            return await networkFirst(request);
        }
        
        // Strategy 3: Stale while revalidate for everything else
        return await staleWhileRevalidate(request);
        
    } catch (error) {
        console.error('[SW] Request failed:', error);
        return await handleOffline(request);
    }
}

// Cache-first strategy
async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network-first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        return cachedResponse || await handleOffline(request);
    }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.status === 200) {
                const cache = caches.open(DYNAMIC_CACHE);
                cache.then(c => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
        })
        .catch(() => null);
    
    return cachedResponse || await networkResponsePromise || await handleOffline(request);
}

// Handle offline scenarios
async function handleOffline(request) {
    const url = new URL(request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        return await caches.match('/WebByteBox/') || 
               new Response('SYSTEM OFFLINE - Check your network connection', {
                   status: 503,
                   headers: { 'Content-Type': 'text/plain' }
               });
    }
    
    // Return offline indicator for other requests
    return new Response('RESOURCE UNAVAILABLE', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
    });
}

// Helper functions
function isStaticAsset(pathname) {
    return pathname.includes('/assets/') || 
           pathname.endsWith('.css') || 
           pathname.endsWith('.js') ||
           pathname.endsWith('.html');
}

function isDynamicAsset(pathname) {
    return DYNAMIC_ASSETS.some(pattern => pathname.includes(pattern));
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'theme-sync') {
        event.waitUntil(syncThemePreferences());
    }
});

async function syncThemePreferences() {
    // Sync theme preferences when back online
    try {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_THEME',
                payload: 'Theme preferences synced'
            });
        });
    } catch (error) {
        console.error('[SW] Theme sync failed:', error);
    }
}
