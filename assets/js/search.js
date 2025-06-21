// Advanced Search System for Byte Box
class ByteBoxSearch {
    constructor() {
        this.searchData = [];
        this.searchIndex = null;
        this.isInitialized = false;
        this.init();
    }
    
    async init() {
        this.createSearchInterface();
        await this.loadSearchData();
        this.setupEventListeners();
        this.isInitialized = true;
    }
    
    createSearchInterface() {
        // Add search to header if not exists
        const header = document.querySelector('.terminal-header .terminal-title-bar');
        if (header && !document.querySelector('.search-container')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <div class="search-input-wrapper">
                    <input type="text" 
                           class="search-input" 
                           placeholder="grep -r 'query' ~/bytebox/*"
                           id="site-search"
                           autocomplete="off">
                    <div class="search-icon">🔍</div>
                </div>
                <div class="search-results" id="search-results" style="display: none;">
                    <div class="search-header">
                        <span class="results-count">0 results found</span>
                        <button class="close-search" aria-label="Close search">×</button>
                    </div>
                    <div class="results-container"></div>
                </div>
            `;
            
            header.appendChild(searchContainer);
            this.addSearchStyles();
        }
    }
    
    addSearchStyles() {
        const styles = `
            .search-container {
                position: relative;
                margin-left: auto;
                z-index: 1000;
            }
            
            .search-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                max-width: 300px;
            }
            
            .search-input {
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid var(--terminal-border);
                color: var(--neon-green);
                font-family: var(--font-mono);
                font-size: 12px;
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: 3px;
                width: 100%;
                transition: all 0.3s ease;
            }
            
            .search-input:focus {
                outline: none;
                border-color: var(--neon-green);
                box-shadow: 0 0 10px var(--neon-green-glow);
                background: rgba(0, 0, 0, 0.9);
            }
            
            .search-icon {
                position: absolute;
                right: var(--spacing-sm);
                color: var(--terminal-text);
                pointer-events: none;
                font-size: 14px;
            }
            
            .search-results {
                position: absolute;
                top: 100%;
                right: 0;
                width: 400px;
                max-width: 90vw;
                background: rgba(0, 0, 0, 0.95);
                border: 1px solid var(--neon-green);
                border-radius: 4px;
                margin-top: var(--spacing-xs);
                max-height: 60vh;
                overflow-y: auto;
                backdrop-filter: blur(10px);
                box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
            }
            
            .search-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-sm);
                border-bottom: 1px solid var(--terminal-border);
                background: rgba(0, 255, 65, 0.1);
            }
            
            .results-count {
                font-size: 12px;
                color: var(--neon-green);
                font-family: var(--font-mono);
            }
            
            .close-search {
                background: none;
                border: none;
                color: var(--red);
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-search:hover {
                background: rgba(255, 0, 64, 0.2);
                border-radius: 3px;
            }
            
            .results-container {
                padding: var(--spacing-sm);
            }
            
            .search-result {
                padding: var(--spacing-sm);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .search-result:hover {
                background: rgba(0, 255, 65, 0.1);
                border-left: 3px solid var(--neon-green);
                padding-left: var(--spacing-md);
            }
            
            .search-result:last-child {
                border-bottom: none;
            }
            
            .result-title {
                color: var(--neon-green);
                font-weight: bold;
                margin-bottom: var(--spacing-xs);
                font-size: 14px;
            }
            
            .result-path {
                color: var(--amber);
                font-size: 11px;
                font-family: var(--font-mono);
                margin-bottom: var(--spacing-xs);
            }
            
            .result-excerpt {
                color: var(--terminal-text);
                font-size: 12px;
                line-height: 1.4;
            }
            
            .result-excerpt mark {
                background: rgba(255, 255, 0, 0.3);
                color: var(--neon-green);
                padding: 0 2px;
                border-radius: 2px;
            }
            
            .no-results {
                text-align: center;
                padding: var(--spacing-lg);
                color: var(--terminal-text);
                font-style: italic;
            }
            
            @media (max-width: 768px) {
                .search-container {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    left: 10px;
                }
                
                .search-results {
                    width: 100%;
                    right: auto;
                    left: 0;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    async loadSearchData() {
        // Build search index from current page content and available pages
        this.searchData = [];
        
        // Index current page
        this.indexCurrentPage();
        
        // Index known pages
        const pages = [
            { url: '/WebByteBox/', title: 'Home', type: 'page' },
            { url: '/WebByteBox/about.html', title: 'About', type: 'page' },
            { url: '/WebByteBox/projects.html', title: 'Projects', type: 'page' },
            { url: '/WebByteBox/archives.html', title: 'Archives', type: 'page' },
            { url: '/WebByteBox/community.html', title: 'Community', type: 'page' },
            { url: '/WebByteBox/contact.html', title: 'Contact', type: 'page' }
        ];
        
        // Add page metadata to search index
        pages.forEach(page => {
            this.searchData.push({
                title: page.title,
                url: page.url,
                type: page.type,
                content: `${page.title} page navigation`,
                excerpt: `Navigate to the ${page.title} section`
            });
        });
        
        // Index common terminal commands and concepts
        const concepts = [
            { term: 'docker', description: 'Containerization platform and homelab orchestration' },
            { term: 'kubernetes', description: 'Container orchestration and cluster management' },
            { term: 'homelab', description: 'Personal infrastructure and experimentation environment' },
            { term: 'raspberry pi', description: 'Single-board computers used in cluster setups' },
            { term: 'networking', description: 'Network configuration, VLANs, and security' },
            { term: 'automation', description: 'Infrastructure automation and scripting' },
            { term: 'security', description: 'Cybersecurity practices and penetration testing' },
            { term: 'monitoring', description: 'System monitoring with Prometheus and Grafana' },
            { term: 'matrix', description: 'Background visual effects and theme system' },
            { term: 'theme', description: 'Color themes and visual customization' }
        ];
        
        concepts.forEach(concept => {
            this.searchData.push({
                title: concept.term,
                url: '#',
                type: 'concept',
                content: concept.description,
                excerpt: concept.description
            });
        });
    }
    
    indexCurrentPage() {
        // Index visible text content on current page
        const contentElements = document.querySelectorAll('h1, h2, h3, p, .terminal-content, .project-name, .log-title');
        
        contentElements.forEach(element => {
            const text = element.textContent.trim();
            if (text.length > 10) {
                this.searchData.push({
                    title: this.extractTitle(element),
                    url: window.location.pathname + '#' + this.generateId(element),
                    type: 'content',
                    content: text,
                    excerpt: text.substring(0, 150) + (text.length > 150 ? '...' : ''),
                    element: element
                });
            }
        });
    }
    
    extractTitle(element) {
        if (element.tagName.match(/^H[1-6]$/)) {
            return element.textContent.trim();
        }
        
        const parent = element.closest('.project-card, .log-entry, .terminal-window');
        if (parent) {
            const title = parent.querySelector('h1, h2, h3, .project-name, .log-title');
            if (title) return title.textContent.trim();
        }
        
        return 'Content';
    }
    
    generateId(element) {
        if (element.id) return element.id;
        return 'search-' + Math.random().toString(36).substr(2, 9);
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('site-search');
        const searchResults = document.getElementById('search-results');
        const closeButton = document.querySelector('.close-search');
        
        if (!searchInput) return;
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });
        
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim()) {
                searchResults.style.display = 'block';
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Ctrl+/ to focus search
            if ((e.ctrlKey && e.key === 'k') || (e.ctrlKey && e.key === '/')) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            
            // Escape to close search
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
        
        closeButton?.addEventListener('click', () => {
            this.closeSearch();
        });
        
        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.closeSearch();
            }
        });
    }
    
    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        const resultsContainer = document.querySelector('.results-container');
        const resultsCount = document.querySelector('.results-count');
        
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = this.searchInIndex(query);
        
        resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} found`;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No results found. Try different keywords.</div>';
        } else {
            resultsContainer.innerHTML = results.map(result => this.renderResult(result, query)).join('');
            
            // Add click handlers to results
            resultsContainer.querySelectorAll('.search-result').forEach((resultEl, index) => {
                resultEl.addEventListener('click', () => {
                    this.navigateToResult(results[index]);
                });
            });
        }
        
        searchResults.style.display = 'block';
    }
    
    searchInIndex(query) {
        const terms = query.toLowerCase().split(/\s+/);
        const results = [];
        
        this.searchData.forEach(item => {
            let score = 0;
            const titleLower = item.title.toLowerCase();
            const contentLower = item.content.toLowerCase();
            
            terms.forEach(term => {
                // Title matches get higher score
                if (titleLower.includes(term)) {
                    score += titleLower === term ? 10 : 5;
                }
                // Content matches
                if (contentLower.includes(term)) {
                    score += 1;
                }
            });
            
            if (score > 0) {
                results.push({
                    ...item,
                    score: score,
                    highlighted: this.highlightMatches(item, terms)
                });
            }
        });
        
        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }
    
    highlightMatches(item, terms) {
        let excerpt = item.excerpt;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            excerpt = excerpt.replace(regex, '<mark>$1</mark>');
        });
        
        return excerpt;
    }
    
    renderResult(result, query) {
        return `
            <div class="search-result" data-url="${result.url}">
                <div class="result-title">${result.title}</div>
                <div class="result-path">${result.url}</div>
                <div class="result-excerpt">${result.highlighted}</div>
            </div>
        `;
    }
    
    navigateToResult(result) {
        if (result.url === '#' || result.url.startsWith('#')) {
            // Scroll to element on current page
            if (result.element) {
                result.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                result.element.style.background = 'rgba(0, 255, 65, 0.2)';
                setTimeout(() => {
                    result.element.style.background = '';
                }, 2000);
            }
        } else {
            // Navigate to different page
            window.location.href = result.url;
        }
        
        this.closeSearch();
    }
    
    closeSearch() {
        const searchResults = document.getElementById('search-results');
        const searchInput = document.getElementById('site-search');
        
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        
        if (searchInput) {
            searchInput.blur();
        }
    }
}

// Initialize search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ByteBoxSearch();
});
