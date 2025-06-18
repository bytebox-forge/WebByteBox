// Matrix Background Effect
// Creates dynamic Matrix-style character rain in the background

class MatrixBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationId = null;
        this.currentTheme = 'classic-green';
        
        this.init();
    }
      init() {
        this.createCanvas();
        this.setupCanvas();
        this.startAnimation();
        this.setupEventListeners();
        this.setupThemeListener();
    }
    
    setupThemeListener() {
        // Listen for theme changes
        window.addEventListener('themeChanged', (e) => {
            this.currentTheme = e.detail.theme;
        });
        
        // Get initial theme from document
        this.currentTheme = document.documentElement.getAttribute('data-theme') || 'classic-green';
    }
    
    getThemeColors() {
        // Get CSS custom properties for current theme
        const rootStyles = getComputedStyle(document.documentElement);
        const primaryColor = rootStyles.getPropertyValue('--primary-color').trim();
        const secondaryColor = rootStyles.getPropertyValue('--secondary-color').trim() || primaryColor;
        const accentColor = rootStyles.getPropertyValue('--accent-color').trim() || primaryColor;
        
        // Fallback colors if CSS variables aren't available
        const fallbackColors = {
            'classic-green': ['#00ff41', '#00ff00', '#008000'],
            'cyber-blue': ['#00d4ff', '#0099cc', '#006699'],
            'hacker-red': ['#ff0040', '#ff3366', '#cc0033'],
            'retro-amber': ['#ffb000', '#ffaa00', '#cc8800'],
            'purple-haze': ['#aa00ff', '#8800cc', '#660099']
        };
        
        return fallbackColors[this.currentTheme] || [primaryColor, secondaryColor, accentColor].filter(Boolean);
    }
    
    createCanvas() {
        const matrixBg = document.querySelector('.matrix-bg');
        if (!matrixBg) return;
        
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.05';
        this.canvas.style.pointerEvents = 'none';
        
        this.ctx = this.canvas.getContext('2d');
        matrixBg.appendChild(this.canvas);
    }
    
    setupCanvas() {
        if (!this.canvas || !this.ctx) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        
        // Initialize drops
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = Math.floor(Math.random() * this.canvas.height / this.fontSize);
        }
    }
      draw() {
        if (!this.ctx || !this.canvas) return;
        
        // Create trailing effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Get theme-aware colors
        const colors = this.getThemeColors();
        
        // Set text properties with primary theme color
        this.ctx.fillStyle = colors[0];
        this.ctx.font = `${this.fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < this.drops.length; i++) {
            // Random character from the set
            const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
            
            // Use random color from theme palette
            this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            
            // Draw the character
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // Reset drop randomly or when it reaches bottom
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            // Move drop down
            this.drops[i]++;
            
            // Add some randomness to the drops
            if (Math.random() > 0.95) {
                this.drops[i] = Math.floor(Math.random() * this.canvas.height / this.fontSize);
            }
        }
    }
    
    startAnimation() {
        const animate = () => {
            this.draw();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    setupEventListeners() {
        // Resize handler
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
        
        // Pause animation when page is not visible (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });
        
        // Speed up matrix when user interacts
        let interactionTimeout = null;
        
        const speedUpMatrix = () => {
            if (this.canvas) {
                this.canvas.style.opacity = '0.15';
            }
            
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                if (this.canvas) {
                    this.canvas.style.opacity = '0.05';
                }
            }, 3000);
        };
        
        document.addEventListener('mousemove', speedUpMatrix);
        document.addEventListener('click', speedUpMatrix);
        document.addEventListener('keydown', speedUpMatrix);
    }
    
    // Method to temporarily intensify the effect
    intensify(duration = 5000) {
        if (!this.canvas) return;
        
        const originalOpacity = this.canvas.style.opacity;
        this.canvas.style.opacity = '0.3';
        
        // Add color variation
        const originalDraw = this.draw.bind(this);
        this.draw = () => {
            if (!this.ctx || !this.canvas) return;
            
            // Create trailing effect
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
              // Draw characters with random colors
            for (let i = 0; i < this.drops.length; i++) {
                const char = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
                
                // Use theme-aware colors instead of hardcoded ones
                const colors = this.getThemeColors();
                this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                this.ctx.font = `${this.fontSize}px monospace`;
                
                this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
                
                if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                    this.drops[i] = 0;
                }
                
                this.drops[i]++;
                
                if (Math.random() > 0.95) {
                    this.drops[i] = Math.floor(Math.random() * this.canvas.height / this.fontSize);
                }
            }
        };
        
        setTimeout(() => {
            this.canvas.style.opacity = originalOpacity;
            this.draw = originalDraw;
        }, duration);
    }
    
    // Method to create a wave effect
    createWave() {
        if (!this.canvas) return;
        
        for (let i = 0; i < this.drops.length; i++) {
            this.drops[i] = Math.sin(i * 0.1) * 10 + 5;
        }
    }
    
    // Method to pause/resume
    toggle() {
        if (this.animationId) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
    
    // Clean up
    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Matrix Particles Effect (alternative/additional effect)
class MatrixParticles {
    constructor() {
        this.particles = [];
        this.maxParticles = 50;
        this.container = document.querySelector('.matrix-bg');
        
        if (this.container) {
            this.init();
        }
    }
    
    init() {
        this.createParticles();
        this.animateParticles();
    }
    
    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const particle = document.createElement('span');
        particle.textContent = this.getRandomChar();
        particle.className = 'matrix-particle';
        particle.style.cssText = `
            position: absolute;
            color: #00ff41;
            font-family: monospace;
            font-size: ${Math.random() * 10 + 10}px;
            opacity: ${Math.random() * 0.5 + 0.1};
            left: ${Math.random() * 100}%;
            top: -20px;
            pointer-events: none;
            z-index: -1;
        `;
        
        this.container.appendChild(particle);
        
        return {
            element: particle,
            speed: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            size: Math.random() * 10 + 10
        };
    }
    
    getRandomChar() {
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        return chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    animateParticles() {
        this.particles.forEach((particle, index) => {
            const rect = particle.element.getBoundingClientRect();
            const newTop = rect.top + particle.speed;
            
            if (newTop > window.innerHeight) {
                // Reset particle to top
                particle.element.style.left = Math.random() * 100 + '%';
                particle.element.style.top = '-20px';
                particle.element.textContent = this.getRandomChar();
                particle.speed = Math.random() * 2 + 0.5;
            } else {
                particle.element.style.top = newTop + 'px';
            }
            
            // Occasionally change character
            if (Math.random() > 0.98) {
                particle.element.textContent = this.getRandomChar();
            }
        });
        
        requestAnimationFrame(() => this.animateParticles());
    }
    
    destroy() {
        this.particles.forEach(particle => {
            if (particle.element && particle.element.parentNode) {
                particle.element.parentNode.removeChild(particle.element);
            }
        });
        this.particles = [];
    }
}

// Initialize matrix background
document.addEventListener('DOMContentLoaded', () => {
    // Use canvas-based matrix for better performance
    if (window.innerWidth > 768) {
        window.matrixBackground = new MatrixBackground();
    } else {
        // Use simpler particle effect on mobile
        window.matrixParticles = new MatrixParticles();
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize for screen size changes
    if (window.matrixBackground) {
        window.matrixBackground.destroy();
        window.matrixBackground = null;
    }
    if (window.matrixParticles) {
        window.matrixParticles.destroy();
        window.matrixParticles = null;
    }
    
    setTimeout(() => {
        if (window.innerWidth > 768) {
            window.matrixBackground = new MatrixBackground();
        } else {
            window.matrixParticles = new MatrixParticles();
        }
    }, 100);
});

// Export for other scripts
window.MatrixBackground = MatrixBackground;
window.MatrixParticles = MatrixParticles;
