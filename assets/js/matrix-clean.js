// Ultra-minimal Matrix Effect - Enhanced version
class SimpleMatrix {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.drops = [];
        this.frameCount = 0;
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
        
        this.animate();
    }
    
    animate() {
        if (!this.ctx) return;
        
        this.frameCount++;
        
        // Only update every 8 frames for much slower animation
        if (this.frameCount % 8 === 0) {
            // Create strong trailing effect with very subtle fade
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Slower fade for longer trails
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);            // Matrix characters without any glow or shadow effects
            this.ctx.fillStyle = '#00ff41';
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
        }
        
        requestAnimationFrame(() => this.animate());
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
