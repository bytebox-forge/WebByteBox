// Performance Optimization Module for Byte Box
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
      init() {
        this.setupLazyLoading();
        this.optimizeMatrix();
        this.setupServiceWorker();
        this.optimizeImages();
        this.addPreloading();
        this.setupPerformanceMonitoring();
        this.optimizeResources();
        
        // Log performance metrics after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.logPerformanceMetrics();
            }, 3000);
        });
    }
    
    // Lazy load non-critical components
    setupLazyLoading() {
        // Lazy load ASCII art on mobile
        const asciiArt = document.querySelector('.ascii-art');
        if (asciiArt && window.innerWidth < 768) {
            asciiArt.style.display = 'none';
            
            // Show text alternative
            const alternative = document.createElement('div');
            alternative.className = 'ascii-alternative';
            alternative.textContent = 'BYTE BOX';
            asciiArt.parentNode.insertBefore(alternative, asciiArt);
        }
        
        // Lazy load terminal effects
        this.setupIntersectionObserver();
    }
    
    // Optimize matrix effect for performance
    optimizeMatrix() {
        if (window.simpleMatrix) {
            // Reduce matrix density on mobile
            if (window.innerWidth < 768) {
                window.simpleMatrix.frameModulo = 16; // Even slower on mobile
            }
            
            // Pause matrix when tab is not visible
            document.addEventListener('visibilitychange', () => {
                if (window.simpleMatrix) {
                    if (document.hidden) {
                        window.simpleMatrix.isPaused = true;
                    } else {
                        window.simpleMatrix.isPaused = false;
                    }
                }
            });
        }
    }
    
    // Setup service worker for caching
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }
    
    // Optimize images and resources
    optimizeImages() {
        // Add loading="lazy" to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
        
        // Preload critical fonts
        const fontLinks = [
            'https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap'
        ];
        
        fontLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    // Setup intersection observer for animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else {
                    entry.target.classList.remove('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe elements that should animate in
        document.querySelectorAll('.boot-line, .project-card, .log-entry').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add resource preloading
    addPreloading() {
        // Preload critical CSS
        const criticalCSS = ['/assets/css/main.css'];
        
        criticalCSS.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
        
        // Preload next likely pages
        const importantPages = ['/about.html', '/projects.html', '/archives.html'];
        
        importantPages.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = href;
            document.head.appendChild(link);
        });
    }
    
    // Advanced Performance Monitoring
    setupPerformanceMonitoring() {
        this.performanceMetrics = {
            navigationStart: null,
            domContentLoaded: null,
            loadComplete: null,
            firstPaint: null,
            firstContentfulPaint: null,
            largestContentfulPaint: null,
            firstInputDelay: null,
            cumulativeLayoutShift: 0
        };
        
        this.collectPerformanceMetrics();
        this.setupPerformanceObserver();
        this.createPerformanceDashboard();
    }

    collectPerformanceMetrics() {
        // Navigation Timing API
        window.addEventListener('load', () => {
            const nav = performance.getEntriesByType('navigation')[0];
            this.performanceMetrics.navigationStart = nav.fetchStart;
            this.performanceMetrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
            this.performanceMetrics.loadComplete = nav.loadEventEnd - nav.navigationStart;
            
            // Paint Timing API
            const paintMetrics = performance.getEntriesByType('paint');
            paintMetrics.forEach(metric => {
                if (metric.name === 'first-paint') {
                    this.performanceMetrics.firstPaint = metric.startTime;
                } else if (metric.name === 'first-contentful-paint') {
                    this.performanceMetrics.firstContentfulPaint = metric.startTime;
                }
            });
            
            this.updatePerformanceDashboard();
        });
    }

    setupPerformanceObserver() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.performanceMetrics.largestContentfulPaint = lastEntry.startTime;
                    this.updatePerformanceDashboard();
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // First Input Delay
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.processingStart && entry.startTime) {
                            this.performanceMetrics.firstInputDelay = entry.processingStart - entry.startTime;
                            this.updatePerformanceDashboard();
                        }
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // Cumulative Layout Shift
                const clsObserver = new PerformanceObserver((list) => {
                    let cls = 0;
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            cls += entry.value;
                        }
                    }
                    this.performanceMetrics.cumulativeLayoutShift += cls;
                    this.updatePerformanceDashboard();
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.log('Performance Observer not fully supported:', e);
            }
        }
    }

    createPerformanceDashboard() {
        if (localStorage.getItem('showPerformanceStats') === 'true') {
            const dashboard = document.createElement('div');
            dashboard.id = 'performance-dashboard';
            dashboard.className = 'performance-dashboard';
            dashboard.innerHTML = `
                <div class="dashboard-header">
                    <h3>Performance Metrics</h3>
                    <button class="dashboard-toggle" onclick="this.parentElement.parentElement.classList.toggle('minimized')">−</button>
                    <button class="dashboard-close" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
                <div class="dashboard-content">
                    <div class="metric-item">
                        <span class="metric-label">Page Load:</span>
                        <span class="metric-value" id="load-time">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">FCP:</span>
                        <span class="metric-value" id="fcp-time">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">LCP:</span>
                        <span class="metric-value" id="lcp-time">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">FID:</span>
                        <span class="metric-value" id="fid-time">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">CLS:</span>
                        <span class="metric-value" id="cls-score">Measuring...</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-label">Memory:</span>
                        <span class="metric-value" id="memory-usage">-</span>
                    </div>
                </div>
            `;
            document.body.appendChild(dashboard);
            
            // Update memory usage periodically
            setInterval(() => {
                if (performance.memory) {
                    const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                    const element = document.getElementById('memory-usage');
                    if (element) {
                        element.textContent = `${memoryMB}MB`;
                        
                        // Color code based on usage
                        if (memoryMB > 100) {
                            element.className = 'metric-value warning';
                        } else if (memoryMB > 50) {
                            element.className = 'metric-value caution';
                        } else {
                            element.className = 'metric-value good';
                        }
                    }
                }
            }, 2000);
        }
    }

    updatePerformanceDashboard() {
        const loadTimeEl = document.getElementById('load-time');
        const fcpTimeEl = document.getElementById('fcp-time');
        const lcpTimeEl = document.getElementById('lcp-time');
        const fidTimeEl = document.getElementById('fid-time');
        const clsScoreEl = document.getElementById('cls-score');

        if (loadTimeEl && this.performanceMetrics.loadComplete) {
            const loadTime = Math.round(this.performanceMetrics.loadComplete);
            loadTimeEl.textContent = `${loadTime}ms`;
            loadTimeEl.className = this.getPerformanceClass(loadTime, [1000, 2500]);
        }

        if (fcpTimeEl && this.performanceMetrics.firstContentfulPaint) {
            const fcpTime = Math.round(this.performanceMetrics.firstContentfulPaint);
            fcpTimeEl.textContent = `${fcpTime}ms`;
            fcpTimeEl.className = this.getPerformanceClass(fcpTime, [1800, 3000]);
        }

        if (lcpTimeEl && this.performanceMetrics.largestContentfulPaint) {
            const lcpTime = Math.round(this.performanceMetrics.largestContentfulPaint);
            lcpTimeEl.textContent = `${lcpTime}ms`;
            lcpTimeEl.className = this.getPerformanceClass(lcpTime, [2500, 4000]);
        }

        if (fidTimeEl && this.performanceMetrics.firstInputDelay) {
            const fidTime = Math.round(this.performanceMetrics.firstInputDelay);
            fidTimeEl.textContent = `${fidTime}ms`;
            fidTimeEl.className = this.getPerformanceClass(fidTime, [100, 300]);
        }

        if (clsScoreEl) {
            const clsScore = this.performanceMetrics.cumulativeLayoutShift.toFixed(3);
            clsScoreEl.textContent = clsScore;
            clsScoreEl.className = this.getPerformanceClass(parseFloat(clsScore), [0.1, 0.25]);
        }
    }

    getPerformanceClass(value, thresholds) {
        if (value <= thresholds[0]) {
            return 'metric-value good';
        } else if (value <= thresholds[1]) {
            return 'metric-value caution';
        } else {
            return 'metric-value warning';
        }
    }

    // Enhanced resource optimization
    optimizeResources() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Defer non-critical JavaScript
        this.deferNonCriticalJS();
        
        // Optimize fonts
        this.optimizeFonts();
        
        // Setup resource hints
        this.setupResourceHints();
    }

    preloadCriticalResources() {
        const criticalResources = [
            '/WebByteBox/assets/css/main.css',
            '/WebByteBox/assets/js/matrix-clean.js',
            '/WebByteBox/assets/js/palette-selector.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            
            if (resource.endsWith('.css')) {
                link.as = 'style';
            } else if (resource.endsWith('.js')) {
                link.as = 'script';
            }
            
            document.head.appendChild(link);
        });
    }

    deferNonCriticalJS() {
        const nonCriticalScripts = [
            'community.js',
            'search.js',
            'terminal.js'
        ];

        nonCriticalScripts.forEach(scriptName => {
            const script = document.querySelector(`script[src*="${scriptName}"]`);
            if (script && !script.defer) {
                script.defer = true;
            }
        });
    }

    optimizeFonts() {
        // Add font-display: swap to improve font loading performance
        const fontLink = document.querySelector('link[href*="fonts.googleapis.com"]');
        if (fontLink) {
            fontLink.href += '&display=swap';
        }
    }

    setupResourceHints() {
        const hints = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
            { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        hints.forEach(hint => {
            const existing = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
            if (!existing) {
                const link = document.createElement('link');
                link.rel = hint.rel;
                link.href = hint.href;
                if (hint.crossorigin) {
                    link.crossOrigin = 'anonymous';
                }
                document.head.appendChild(link);
            }
        });
    }

    // Performance debugging console
    logPerformanceMetrics() {
        console.group('🚀 ByteBox Performance Metrics');
        console.log('Page Load Time:', this.performanceMetrics.loadComplete, 'ms');
        console.log('First Contentful Paint:', this.performanceMetrics.firstContentfulPaint, 'ms');
        console.log('Largest Contentful Paint:', this.performanceMetrics.largestContentfulPaint, 'ms');
        console.log('First Input Delay:', this.performanceMetrics.firstInputDelay, 'ms');
        console.log('Cumulative Layout Shift:', this.performanceMetrics.cumulativeLayoutShift);
        if (performance.memory) {
            console.log('JS Heap Size:', Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), 'MB');
        }
        console.groupEnd();
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});

// Performance mode styles
const performanceCSS = `
    .performance-mode .matrix-bg {
        display: none !important;
    }
    
    .performance-mode .scanlines {
        display: none !important;
    }
    
    .performance-mode * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(100%); }
        20%, 80% { opacity: 1; transform: translateX(0); }
    }
`;

const style = document.createElement('style');
style.textContent = performanceCSS;
document.head.appendChild(style);
