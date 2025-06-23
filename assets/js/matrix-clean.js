// Ultra-minimal Matrix Effect - Theme-aware version with overlay support
class SimpleMatrix {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.overlayCanvas = null;
        this.overlayCtx = null;
        this.drops = [];
        this.frameCount = 0;
        this.currentColor = '#00ff41'; // Default fallback        this.overlaySettings = {
            enabled: false, // Temporarily disable overlay to test matrix
            type: 'scanlines', // Default to professional scanlines
            opacity: 0.15, // Light overlay so matrix shows through
            speed: 1,
            color: '#00ff41',
            intensity: 'medium' // 'low', 'medium', 'high'
        };
        this.init();
    }
      init() {
        console.log('Matrix init starting...');
        const container = document.querySelector('.matrix-bg');
        if (!container) {
            console.error('Matrix container not found!');
            return;
        }
        console.log('Matrix container found:', container);
        
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
        console.log('Creating', columns, 'matrix columns');
        for (let i = 0; i < columns; i++) {
            this.drops[i] = Math.random() * this.canvas.height;
        }
        
        // Update color from CSS theme
        this.updateColor();
        
        // Listen for theme changes
        this.setupThemeListener();
          // Setup overlay controls
        this.setupOverlayControls();

        console.log('Starting matrix animation...');
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
            case 'cyberpunk-mix':
                this.drawCyberpunkMix();
                break;
            case 'data-stream':
                this.drawDataStream();
                break;
            case 'holographic':
                this.drawHolographic();
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
    
    // New enhanced overlay methods
    drawCyberpunkMix() {
        // Combination of subtle scanlines + circuit grid + data elements
        this.overlayCtx.globalAlpha = this.overlaySettings.opacity * 0.7;
        
        // Subtle scanlines
        this.overlayCtx.strokeStyle = this.overlaySettings.color;
        this.overlayCtx.lineWidth = 0.5;
        for (let y = 0; y < this.overlayCanvas.height; y += 4) {
            if (Math.random() > 0.8) { // Sparse scanlines
                this.overlayCtx.globalAlpha = this.overlaySettings.opacity * (0.3 + Math.random() * 0.3);
                this.overlayCtx.beginPath();
                this.overlayCtx.moveTo(0, y);
                this.overlayCtx.lineTo(this.overlayCanvas.width, y);
                this.overlayCtx.stroke();
            }
        }
        
        // Circuit-style grid (very subtle)
        this.overlayCtx.globalAlpha = this.overlaySettings.opacity * 0.3;
        this.overlayCtx.strokeStyle = this.overlaySettings.color;
        this.overlayCtx.lineWidth = 0.3;
        
        const gridSize = 100;
        for (let x = 0; x < this.overlayCanvas.width; x += gridSize) {
            for (let y = 0; y < this.overlayCanvas.height; y += gridSize) {
                if (Math.random() > 0.7) {
                    // Draw small circuit-like rectangles
                    this.overlayCtx.strokeRect(x, y, 20, 15);
                }
            }
        }
    }
    
    drawDataStream() {
        // Floating binary/hex numbers
        this.overlayCtx.fillStyle = this.overlaySettings.color;
        this.overlayCtx.font = '12px monospace';
        this.overlayCtx.globalAlpha = this.overlaySettings.opacity * 0.6;
        
        const dataChars = '01ABCDEF';
        const streamCount = 15;
        
        for (let i = 0; i < streamCount; i++) {
            const x = Math.random() * this.overlayCanvas.width;
            const y = (Date.now() * 0.05 + i * 50) % (this.overlayCanvas.height + 100);
            const char = dataChars[Math.floor(Math.random() * dataChars.length)];
            
            // Fade based on position
            this.overlayCtx.globalAlpha = this.overlaySettings.opacity * (1 - y / this.overlayCanvas.height);
            this.overlayCtx.fillText(char, x, y);
        }
    }
    
    drawHolographic() {
        // Subtle RGB distortion effect
        const time = Date.now() * 0.001;
        
        // Create subtle color separation effect
        this.overlayCtx.globalCompositeOperation = 'screen';
        this.overlayCtx.globalAlpha = this.overlaySettings.opacity * 0.1;
        
        // Red channel shift
        this.overlayCtx.fillStyle = '#ff0000';
        this.overlayCtx.fillRect(1, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Green channel shift
        this.overlayCtx.fillStyle = '#00ff00';
        this.overlayCtx.fillRect(-1, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Occasional glitch lines
        if (Math.random() > 0.95) {
            this.overlayCtx.globalAlpha = this.overlaySettings.opacity * 0.5;
            this.overlayCtx.fillStyle = this.overlaySettings.color;
            const y = Math.random() * this.overlayCanvas.height;
            this.overlayCtx.fillRect(0, y, this.overlayCanvas.width, 2);
        }
        
        this.overlayCtx.globalCompositeOperation = 'source-over';
    }    animate() {
        if (!this.ctx) {
            console.error('Canvas context not available!');
            return;
        }
        
        this.frameCount++;
        
        // Only update every 8 frames for much slower animation
        if (this.frameCount % 8 === 0) {
            console.log('Drawing matrix frame', this.frameCount);// Create trailing effect with very light fade
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.005)'; // Much slower fade to keep matrix visible
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);            // Matrix characters with bright green color at full opacity
            this.ctx.fillStyle = '#00ff41'; // Force bright green
            this.ctx.globalAlpha = 1.0; // Full opacity for maximum visibility
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
