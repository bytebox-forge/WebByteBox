// Accessibility and UX Enhancements for Byte Box
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
      init() {
        this.addKeyboardNavigation();
        this.addSkipLinks();
        this.addFocusManagement();
        this.addReducedMotionSupport();
        this.addTouchGestures();
        this.addAdvancedAccessibility();
        this.loadAccessibilityPreferences();
    }
    
    // Add keyboard navigation for terminal interface
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation for palette selector
            if (e.key === 'Tab') {
                const paletteOptions = document.querySelectorAll('.palette-option');
                if (paletteOptions.length > 0) {
                    paletteOptions.forEach(option => {
                        option.setAttribute('tabindex', '0');
                        option.setAttribute('role', 'button');
                        option.setAttribute('aria-label', `Switch to ${option.dataset.theme} theme`);
                    });
                }
            }
            
            // Enter key activation
            if (e.key === 'Enter' && e.target.classList.contains('palette-option')) {
                e.target.click();
            }
            
            // Quick theme switching with numbers
            if (e.altKey && !isNaN(e.key) && e.key >= '1' && e.key <= '5') {
                const themes = ['classic-green', 'cyber-blue', 'hacker-red', 'retro-amber', 'purple-haze'];
                const themeIndex = parseInt(e.key) - 1;
                if (themes[themeIndex]) {
                    document.querySelector(`[data-theme="${themes[themeIndex]}"]`)?.click();
                }
            }
        });
    }
    
    // Add skip links for screen readers
    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--neon-green);
            color: var(--bg-black);
            padding: 8px;
            text-decoration: none;
            border-radius: 3px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    // Improve focus management
    addFocusManagement() {
        // Ensure proper focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .focus-visible {
                outline: 2px solid var(--neon-green) !important;
                outline-offset: 2px !important;
            }
            
            .palette-option:focus-visible {
                outline: 3px solid var(--neon-green);
                outline-offset: 3px;
            }
            
            .dir-item:focus-visible {
                background: rgba(0, 255, 65, 0.1);
                outline: 1px solid var(--neon-green);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Respect reduced motion preferences
    addReducedMotionSupport() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            
            // Disable matrix animation
            if (window.simpleMatrix) {
                window.simpleMatrix.canvas.style.display = 'none';
            }
            
            // Reduce or eliminate animations
            const style = document.createElement('style');
            style.textContent = `
                .reduced-motion * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
                
                .reduced-motion .typing-text {
                    animation: none;
                }
                
                .reduced-motion .boot-line {
                    animation: none;
                    opacity: 1;
                }
                
                .reduced-motion .glitch-text {
                    animation: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Add touch gesture support
    addTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Horizontal swipe for theme switching
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                const paletteSelector = document.querySelector('.palette-selector');
                if (paletteSelector) {
                    if (diffX > 0) {
                        // Swipe left - next theme
                        this.cycleTheme(1);
                    } else {
                        // Swipe right - previous theme
                        this.cycleTheme(-1);
                    }
                }
            }
        });
    }
    
    cycleTheme(direction) {
        const themes = ['classic-green', 'cyber-blue', 'hacker-red', 'retro-amber', 'purple-haze'];
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'classic-green';
        const currentIndex = themes.indexOf(currentTheme);
        
        let nextIndex = currentIndex + direction;
        if (nextIndex >= themes.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = themes.length - 1;
        
        const nextButton = document.querySelector(`[data-theme="${themes[nextIndex]}"]`);
        if (nextButton) {
            nextButton.click();
        }
    }
    
    // Advanced Accessibility Features
    addAdvancedAccessibility() {
        this.addColorBlindnessSupport();
        this.addTextSizeControls();
        this.addAnimationControls();
        this.addHighContrastMode();
        this.addScreenReaderEnhancements();
    }

    addColorBlindnessSupport() {
        // Add colorblind-friendly indicators
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(option => {
            const theme = option.dataset.theme;
            let pattern = '';
            
            switch(theme) {
                case 'classic-green':
                    pattern = '▓▓▓';
                    break;
                case 'cyber-blue':
                    pattern = '░░░';
                    break;
                case 'hacker-red':
                    pattern = '███';
                    break;
                case 'retro-amber':
                    pattern = '▒▒▒';
                    break;
                case 'purple-haze':
                    pattern = '▐▐▐';
                    break;
            }
            
            if (pattern) {
                const patternSpan = document.createElement('span');
                patternSpan.className = 'colorblind-pattern';
                patternSpan.textContent = pattern;
                patternSpan.style.cssText = `
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    font-size: 8px;
                    opacity: 0.7;
                    pointer-events: none;
                `;
                option.appendChild(patternSpan);
            }
        });
    }

    addTextSizeControls() {
        // Create text size control
        const textSizeControl = document.createElement('div');
        textSizeControl.className = 'text-size-control';
        textSizeControl.innerHTML = `
            <button class="text-size-btn" data-size="small" aria-label="Decrease text size">A-</button>
            <button class="text-size-btn" data-size="normal" aria-label="Normal text size">A</button>
            <button class="text-size-btn" data-size="large" aria-label="Increase text size">A+</button>
        `;
        
        // Add to header or create a settings panel
        const settingsPanel = this.getOrCreateSettingsPanel();
        settingsPanel.appendChild(textSizeControl);
        
        // Add event listeners
        textSizeControl.addEventListener('click', (e) => {
            if (e.target.classList.contains('text-size-btn')) {
                const size = e.target.dataset.size;
                this.setTextSize(size);
                
                // Update active state
                textSizeControl.querySelectorAll('.text-size-btn').forEach(btn => 
                    btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    setTextSize(size) {
        const root = document.documentElement;
        switch(size) {
            case 'small':
                root.style.setProperty('--font-size-base', '12px');
                root.style.setProperty('--font-size-small', '10px');
                break;
            case 'large':
                root.style.setProperty('--font-size-base', '18px');
                root.style.setProperty('--font-size-small', '16px');
                break;
            default:
                root.style.setProperty('--font-size-base', '14px');
                root.style.setProperty('--font-size-small', '12px');
        }
        
        localStorage.setItem('textSize', size);
    }

    addAnimationControls() {
        const animationControl = document.createElement('div');
        animationControl.className = 'animation-control';
        animationControl.innerHTML = `
            <label class="toggle-label">
                <input type="checkbox" class="animation-toggle" checked>
                <span class="toggle-slider"></span>
                <span class="toggle-text">Animations</span>
            </label>
        `;
        
        const settingsPanel = this.getOrCreateSettingsPanel();
        settingsPanel.appendChild(animationControl);
        
        const toggle = animationControl.querySelector('.animation-toggle');
        toggle.addEventListener('change', (e) => {
            this.toggleAnimations(e.target.checked);
        });
    }

    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('reduced-motion');
        } else {
            document.body.classList.add('reduced-motion');
        }
        
        localStorage.setItem('animationsEnabled', enabled);
    }

    addHighContrastMode() {
        const contrastControl = document.createElement('div');
        contrastControl.className = 'contrast-control';
        contrastControl.innerHTML = `
            <label class="toggle-label">
                <input type="checkbox" class="contrast-toggle">
                <span class="toggle-slider"></span>
                <span class="toggle-text">High Contrast</span>
            </label>
        `;
        
        const settingsPanel = this.getOrCreateSettingsPanel();
        settingsPanel.appendChild(contrastControl);
        
        const toggle = contrastControl.querySelector('.contrast-toggle');
        toggle.addEventListener('change', (e) => {
            this.toggleHighContrast(e.target.checked);
        });
    }

    toggleHighContrast(enabled) {
        if (enabled) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        localStorage.setItem('highContrast', enabled);
    }

    addScreenReaderEnhancements() {
        // Add live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only live-region';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
        
        // Announce major page changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Announce new content
                            if (node.classList && node.classList.contains('terminal-window')) {
                                this.announceToScreenReader('New terminal window opened');
                            }
                            if (node.classList && node.classList.contains('command-result')) {
                                this.announceToScreenReader('Command executed, result available');
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    getOrCreateSettingsPanel() {
        let panel = document.getElementById('accessibility-settings');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'accessibility-settings';
            panel.className = 'accessibility-settings';
            panel.innerHTML = `
                <button class="settings-toggle" aria-label="Toggle accessibility settings">
                    ⚙️
                </button>
                <div class="settings-content" style="display: none;">
                    <h3>Accessibility Settings</h3>
                </div>
            `;
            document.body.appendChild(panel);
            
            // Toggle functionality
            const toggle = panel.querySelector('.settings-toggle');
            const content = panel.querySelector('.settings-content');
            
            toggle.addEventListener('click', () => {
                const isOpen = content.style.display !== 'none';
                content.style.display = isOpen ? 'none' : 'block';
                toggle.setAttribute('aria-expanded', !isOpen);
            });
        }
        
        return panel.querySelector('.settings-content');
    }

    // Load saved accessibility preferences
    loadAccessibilityPreferences() {
        const textSize = localStorage.getItem('textSize');
        if (textSize) {
            this.setTextSize(textSize);
            const sizeBtn = document.querySelector(`[data-size="${textSize}"]`);
            if (sizeBtn) sizeBtn.classList.add('active');
        }
        
        const animationsEnabled = localStorage.getItem('animationsEnabled');
        if (animationsEnabled === 'false') {
            this.toggleAnimations(false);
            const animToggle = document.querySelector('.animation-toggle');
            if (animToggle) animToggle.checked = false;
        }
        
        const highContrast = localStorage.getItem('highContrast');
        if (highContrast === 'true') {
            this.toggleHighContrast(true);
            const contrastToggle = document.querySelector('.contrast-toggle');
            if (contrastToggle) contrastToggle.checked = true;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityEnhancer();
});
