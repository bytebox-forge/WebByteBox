/**
 * Cyberpunk Color Palette Selector
 * Allows users to switch between different color themes
 */

class PaletteSelector {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'classic-green';
        this.paletteOptions = document.querySelectorAll('.palette-option');
        
        this.init();
    }

    init() {
        // Apply stored theme on page load
        this.applyTheme(this.currentTheme);
        
        // Add click listeners to palette options
        this.paletteOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = option.dataset.theme;
                this.switchTheme(theme);
            });
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+T for theme cycling
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.cycleTheme();
            }
        });

        // Add glitch effect to palette selector on hover
        this.addGlitchEffects();
    }

    switchTheme(theme) {
        if (theme === this.currentTheme) return;
        
        this.currentTheme = theme;
        this.applyTheme(theme);
        this.updateActiveButton(theme);
        this.storeTheme(theme);
        
        // Add visual feedback
        this.triggerSwitchEffect();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update active button state
        this.updateActiveButton(theme);
          // Trigger custom event for other components that might need to know
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme }        }));
          // Trigger matrix background refresh if it exists (updated for matrix-clean.js)
        if (window.simpleMatrix && typeof window.simpleMatrix.refreshColor === 'function') {
            // Force manual refresh of matrix color
            window.simpleMatrix.refreshColor();
        }
    }

    updateActiveButton(theme) {
        this.paletteOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }

    cycleTheme() {
        const themes = ['classic-green', 'cyber-blue', 'hacker-red', 'retro-amber', 'purple-haze'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.switchTheme(themes[nextIndex]);
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('cyberpunk-theme');
        } catch (e) {
            console.warn('LocalStorage not available, using default theme');
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem('cyberpunk-theme', theme);
        } catch (e) {
            console.warn('Could not store theme preference');
        }
    }

    triggerSwitchEffect() {
        // Add a brief screen flash effect when switching themes
        const flashOverlay = document.createElement('div');
        flashOverlay.className = 'theme-switch-flash';
        flashOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: var(--primary-color);
            opacity: 0.1;
            pointer-events: none;
            z-index: 9999;
            animation: themeSwitch 0.3s ease-out;
        `;
        
        document.body.appendChild(flashOverlay);
        
        // Add keyframe animation dynamically
        if (!document.querySelector('#theme-switch-styles')) {
            const style = document.createElement('style');
            style.id = 'theme-switch-styles';
            style.textContent = `
                @keyframes themeSwitch {
                    0% { opacity: 0.3; }
                    50% { opacity: 0.1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            document.body.removeChild(flashOverlay);
        }, 300);
    }

    addGlitchEffects() {
        // Add subtle glitch effect to palette selector
        const paletteSelector = document.querySelector('.palette-selector');
        if (!paletteSelector) return;

        paletteSelector.addEventListener('mouseenter', () => {
            paletteSelector.classList.add('glitch-hover');
        });

        paletteSelector.addEventListener('mouseleave', () => {
            paletteSelector.classList.remove('glitch-hover');
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PaletteSelector();
});

// Export for potential external use
window.PaletteSelector = PaletteSelector;
