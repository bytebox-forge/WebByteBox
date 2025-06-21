// Ultra-minimal Matrix Effect - Theme-aware version
class SimpleMatrix {    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.frameCount = 0;
        this.currentColor = '#00ff41'; // Default fallback
        this.init();
    }
    
    init() {
        const container = document.querySelector('.matrix-bg');
        if (!container) return;
        
        // Create canvas with minimal styling
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
          // Canvas styling to prevent layout issues
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // Ensure it stays behind content
        
        this.ctx = this.canvas.getContext('2d');
        
        // Ensure canvas has transparent background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        container.appendChild(this.canvas);
        
        // Initialize drops with slower spacing
        const columns = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
        
        // Update color from CSS theme
        this.updateColor();
        
        // Listen for theme changes
        this.setupThemeListener();
        
        this.animate();
    }    updateColor() {
        // Get the current --neon-green color from CSS
        const computedStyle = getComputedStyle(document.documentElement);
        const neonGreen = computedStyle.getPropertyValue('--neon-green').trim();
        
        if (neonGreen) {
            this.currentColor = neonGreen;
        }
    }    setupThemeListener() {
        // Listen for theme change events
        window.addEventListener('themeChanged', () => {
            this.updateColor();
        });
        
        // Also listen for any CSS variable changes
        const observer = new MutationObserver(() => {
            this.updateColor();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    animate() {
        if (!this.ctx) return;
        
        this.frameCount++;
        
        // Only update every 8 frames for much slower animation
        if (this.frameCount % 8 === 0) {
            // Create strong trailing effect with very subtle fade
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slower fade for longer trails
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);            // Matrix characters with theme-aware color at 100% opacity
            this.ctx.fillStyle = this.currentColor;
            this.ctx.globalAlpha = 1.0; // Set 100% opacity
            this.ctx.font = 'bold 20px monospace';
            // Ensure no shadow effects
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;            for (let i = 0; i < this.drops.length; i++) {
                const char = Math.random() > 0.5 ? '1' : '0';
                const x = i * 20;
                const y = this.drops[i];
                
                // Draw character without any glow
                this.ctx.fillText(char, x, y);
                
                // Move drop down slowly
                this.drops[i] += 20;
                if (this.drops[i] > this.canvas.height) {
                    this.drops[i] = -Math.random() * 200; // Start higher for better distribution
                }
            }
            
            // Reset opacity for other drawing operations
            this.ctx.globalAlpha = 1.0;
        }        
        requestAnimationFrame(() => this.animate());
    }
      // Method to manually refresh color (useful for debugging)
    refreshColor() {
        this.updateColor();
    }
}

// Initialize with delay
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.querySelector('.matrix-bg')) {
            window.simpleMatrix = new SimpleMatrix();
        }
    }, 500);
});
