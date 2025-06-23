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
        this.overlaySettings = {
            enabled: true,
            type: 'scanlines', // 'scanlines', 'grid', 'noise', 'gradient', 'pulse'
            opacity: 0.3,
            speed: 1,
            color: '#00ff41'
        };
        this.init();
    }
    
    init() {
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
        this.canvas.style.zIndex = '-2'; // Matrix behind overlay
        
        this.ctx = this.canvas.getContext('2d');
        
        // Create overlay canvas
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = window.innerWidth;
        this.overlayCanvas.height = window.innerHeight;
        
        this.overlayCanvas.style.position = 'fixed';
        this.overlayCanvas.style.top = '0';
        this.overlayCanvas.style.left = '0';
        this.overlayCanvas.style.pointerEvents = 'none';
        this.overlayCanvas.style.zIndex = '-1'; // Overlay on top of matrix
        
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        
        // Ensure canvases have transparent background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        container.appendChild(this.canvas);
        container.appendChild(this.overlayCanvas);
        
        // Initialize drops with slower spacing
        const columns = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
        
        // Update color from CSS theme
        this.updateColor();
        
        // Listen for theme changes
        this.setupThemeListener();
        
        // Setup overlay controls
        this.setupOverlayControls();
        
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
    
    setupOverlayControls() {
        // Initial draw of the overlay
        this.drawOverlay();
        
        // Update overlay settings on each animation frame
        const updateOverlay = () => {
            if (this.overlaySettings.enabled) {
                this.drawOverlay();
            }
            requestAnimationFrame(updateOverlay);
        };
        requestAnimationFrame(updateOverlay);
    }
    
    drawOverlay() {
        if (!this.overlayCtx || !this.overlaySettings.enabled) return;
        
        // Clear the overlay context
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        const { type, opacity, speed, color } = this.overlaySettings;
        this.overlayCtx.globalAlpha = opacity;
        
        switch (type) {
            case 'scanlines':
                this.drawScanlines();
                break;
            case 'grid':
                this.drawGrid();
                break;
            case 'noise':
                this.drawNoise();
                break;
            case 'gradient':
                this.drawGradient();
                break;
            case 'pulse':
                this.drawPulse();
                break;
            case 'crt':
                this.drawCRT();
                break;
        }
        
        this.overlayCtx.globalAlpha = 1; // Reset alpha
    }
    
    drawScanlines() {
        const lineHeight = 2;
        const spacing = 4;
        const speed = this.overlaySettings.speed;
        const offset = (this.frameCount * speed) % (spacing + lineHeight);
        
        this.overlayCtx.fillStyle = this.overlaySettings.color;
        
        for (let y = -offset; y < this.overlayCanvas.height + spacing; y += spacing + lineHeight) {
            this.overlayCtx.fillRect(0, y, this.overlayCanvas.width, lineHeight);
        }
    }
    
    drawGrid() {
        const gridSize = 20;
        this.overlayCtx.strokeStyle = this.overlaySettings.color;
        this.overlayCtx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.overlayCanvas.width; x += gridSize) {
            this.overlayCtx.beginPath();
            this.overlayCtx.moveTo(x, 0);
            this.overlayCtx.lineTo(x, this.overlayCanvas.height);
            this.overlayCtx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.overlayCanvas.height; y += gridSize) {
            this.overlayCtx.beginPath();
            this.overlayCtx.moveTo(0, y);
            this.overlayCtx.lineTo(this.overlayCanvas.width, y);
            this.overlayCtx.stroke();
        }
    }
    
    drawNoise() {
        const imageData = this.overlayCtx.createImageData(this.overlayCanvas.width, this.overlayCanvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255;
            data[i] = noise;     // R
            data[i + 1] = noise; // G  
            data[i + 2] = noise; // B
            data[i + 3] = Math.random() * 50; // A (low alpha for subtle effect)
        }
        
        this.overlayCtx.putImageData(imageData, 0, 0);
    }
    
    drawGradient() {
        const gradient = this.overlayCtx.createLinearGradient(0, 0, 0, this.overlayCanvas.height);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, this.overlaySettings.color);
        gradient.addColorStop(1, 'transparent');
        
        this.overlayCtx.fillStyle = gradient;
        this.overlayCtx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }
    
    drawPulse() {
        const time = this.frameCount * 0.02 * this.overlaySettings.speed;
        const pulse = (Math.sin(time) + 1) / 2; // 0 to 1
        
        this.overlayCtx.globalAlpha = this.overlaySettings.opacity * pulse;
        this.overlayCtx.fillStyle = this.overlaySettings.color;
        this.overlayCtx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }
    
    drawCRT() {
        // Combine scanlines with slight curvature effect
        this.drawScanlines();
        
        // Add slight vignette
        const centerX = this.overlayCanvas.width / 2;
        const centerY = this.overlayCanvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        const gradient = this.overlayCtx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxRadius
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.8, 'transparent');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        this.overlayCtx.fillStyle = gradient;
        this.overlayCtx.fillRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }    animate() {
        if (!this.ctx) return;
        
        this.frameCount++;
        
        // Only update every 8 frames for much slower animation
        if (this.frameCount % 8 === 0) {
            // Create strong trailing effect with very subtle fade
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slower fade for longer trails
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Matrix characters with theme-aware color at 100% opacity
            this.ctx.fillStyle = this.currentColor;
            this.ctx.globalAlpha = 1.0; // Set 100% opacity
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
            }
            
            // Reset opacity for other drawing operations
            this.ctx.globalAlpha = 1.0;
        }
        
        // Update overlay on every frame for smooth effects
        if (this.overlaySettings.enabled) {
            this.drawOverlay();
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
