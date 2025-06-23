// Ultra-minimal Matrix Effect - Theme-aware version with overlay support
class SimpleMatrix {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.overlayCanvas = null;
        this.overlayCtx = null;
        this.drops = [];
        this.frameCount = 0;
        this.currentColor = '#00ff41'; // Default fallback
        this.init();
    }init() {
        const container = document.querySelector('.matrix-bg');
        if (!container) return;
        
        // Create main matrix canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Canvas styling to prevent layout issues
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-2';
          this.ctx = this.canvas.getContext('2d');
        
        // Create simple overlay canvas
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = window.innerWidth;
        this.overlayCanvas.height = window.innerHeight;
        
        this.overlayCanvas.style.position = 'fixed';
        this.overlayCanvas.style.top = '0';
        this.overlayCanvas.style.left = '0';
        this.overlayCanvas.style.pointerEvents = 'none';
        this.overlayCanvas.style.zIndex = '-1'; // Overlay on top of matrix
        
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        
        container.appendChild(this.canvas);
        container.appendChild(this.overlayCanvas);
        
        // Create simple black overlay with 20% opacity
        this.createSimpleOverlay();
        
        // Initialize drops
        const columns = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
        
        // Update color from CSS theme
        this.updateColor();
        
        // Listen for theme changes
        this.setupThemeListener();
        
        this.animate();
    }updateColor() {
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
        if (!this.ctx) {
            console.error('Canvas context not available!');
            return;
        }
        
        this.frameCount++;
          // Only update every 8 frames for much slower animation
        if (this.frameCount % 8 === 0) {
            // Create trailing effect with normal fade
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Matrix characters with theme-aware color
            this.ctx.fillStyle = this.currentColor;
            this.ctx.globalAlpha = 1.0;
            this.ctx.font = 'bold 20px monospace';
            // Ensure no shadow effects
            this.ctx.shadowColor = 'transparent';
            this.ctx.shadowBlur = 0;
            
            for (let i = 0; i < this.drops.length; i++) {
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
            }            // Reset opacity for other drawing operations
            this.ctx.globalAlpha = 1.0;
        }
        
        requestAnimationFrame(() => this.animate());
    }
      // Method to manually refresh color (useful for debugging)
    refreshColor() {
        this.updateColor();
    }    createSimpleOverlay() {
        if (!this.overlayCtx) return;
        
        // Clear the overlay
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Create simple black overlay with 50% opacity
        this.overlayCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.overlayCtx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
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
