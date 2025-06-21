// Glitch Effects JavaScript
// Cyberpunk-style visual glitch effects and animations

class GlitchEffects {
    constructor() {
        this.glitchElements = document.querySelectorAll('.glitch-text');
        this.isGlitching = false;
        this.glitchInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupGlitchText();
        this.setupRandomGlitches();
        this.setupErrorPageGlitches();
    }
    
    setupGlitchText() {
        this.glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.startGlitch(element);
            });
            
            element.addEventListener('mouseleave', () => {
                this.stopGlitch(element);
            });
        });
    }
    
    startGlitch(element) {
        if (this.isGlitching) return;
        
        this.isGlitching = true;
        const originalText = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
        let iterations = 0;
        const maxIterations = 20;
        
        this.glitchInterval = setInterval(() => {
            if (iterations >= maxIterations) {
                element.textContent = originalText;
                this.stopGlitch(element);
                return;
            }
            
            // Randomly glitch some characters
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (Math.random() < 0.1) {
                        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    }
                    return char;
                })
                .join('');
            
            iterations++;
        }, 50);
    }
    
    stopGlitch(element) {
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
            this.glitchInterval = null;
        }
        this.isGlitching = false;
    }
    
    setupRandomGlitches() {
        // Random screen glitches every 30-60 seconds
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                this.triggerScreenGlitch();
            }
        }, 30000 + Math.random() * 30000);
    }
    
    triggerScreenGlitch() {
        const glitchOverlay = document.createElement('div');
        glitchOverlay.className = 'glitch-overlay';
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255, 0, 64, 0.1) 25%, 
                transparent 26%, 
                transparent 74%, 
                rgba(138, 43, 226, 0.1) 75%, 
                transparent 100%
            );
            animation: glitch-overlay 0.3s ease-in-out;
        `;
        
        document.body.appendChild(glitchOverlay);
        
        // Also briefly distort some text
        const textElements = document.querySelectorAll('h1, h2, h3, .terminal-title');
        const randomElement = textElements[Math.floor(Math.random() * textElements.length)];
        
        if (randomElement) {
            const originalTransform = randomElement.style.transform;
            randomElement.style.transform = `translateX(${Math.random() * 4 - 2}px) skewX(${Math.random() * 2 - 1}deg)`;
            randomElement.style.filter = 'hue-rotate(180deg)';
            
            setTimeout(() => {
                randomElement.style.transform = originalTransform;
                randomElement.style.filter = '';
            }, 150);
        }
        
        // Remove overlay after animation
        setTimeout(() => {
            glitchOverlay.remove();
        }, 500);
    }
    
    setupErrorPageGlitches() {
        // Special glitches for 404 page
        if (document.querySelector('.error-terminal')) {
            this.startErrorPageEffects();
        }
    }
    
    startErrorPageEffects() {
        // More frequent glitches on error page
        setInterval(() => {
            this.triggerScreenGlitch();
        }, 5000 + Math.random() * 10000);
        
        // Glitch the ASCII art
        const errorAscii = document.querySelector('.error-ascii');
        if (errorAscii) {
            setInterval(() => {
                this.glitchAsciiArt(errorAscii);
            }, 3000 + Math.random() * 7000);
        }
        
        // Randomly corrupt log entries
        const logLines = document.querySelectorAll('.log-line');
        if (logLines.length > 0) {
            setInterval(() => {
                this.corruptLogLine();
            }, 8000 + Math.random() * 12000);
        }
    }
    
    glitchAsciiArt(element) {
        const originalContent = element.innerHTML;
        const lines = originalContent.split('\n');
        
        // Randomly corrupt some lines
        const corruptedLines = lines.map(line => {
            if (Math.random() < 0.2) { // 20% chance per line
                return line
                    .split('')
                    .map(char => {
                        if (Math.random() < 0.1) {
                            return '▓▒░'[Math.floor(Math.random() * 3)];
                        }
                        return char;
                    })
                    .join('');
            }
            return line;
        });
        
        element.innerHTML = corruptedLines.join('\n');
        element.style.color = '#ff0040';
        
        // Restore after a brief moment
        setTimeout(() => {
            element.innerHTML = originalContent;
            element.style.color = '';
        }, 200);
    }
    
    corruptLogLine() {
        const logLines = document.querySelectorAll('.log-line');
        if (logLines.length === 0) return;
        
        const randomLine = logLines[Math.floor(Math.random() * logLines.length)];
        const originalContent = randomLine.innerHTML;
        
        // Corrupt the message
        const messageElement = randomLine.querySelector('.message');
        if (messageElement) {
            const corruptedText = messageElement.textContent
                .split('')
                .map(char => {
                    if (Math.random() < 0.3) {
                        return '█▓▒░'[Math.floor(Math.random() * 4)];
                    }
                    return char;
                })
                .join('');
            
            messageElement.textContent = corruptedText;
            messageElement.style.color = '#ff0040';
            
            // Restore after corruption
            setTimeout(() => {
                randomLine.innerHTML = originalContent;
            }, 1000);
        }
    }
    
    // Data corruption effect for text
    corruptText(element, corruptionLevel = 0.1) {
        const originalText = element.textContent;
        const corruptChars = '█▓▒░▄▀■□▪▫◘○●';
        
        const corruptedText = originalText
            .split('')
            .map(char => {
                if (Math.random() < corruptionLevel) {
                    return corruptChars[Math.floor(Math.random() * corruptChars.length)];
                }
                return char;
            })
            .join('');
        
        element.textContent = corruptedText;
        
        return originalText; // Return for restoration
    }
      // Matrix-style character rain effect - DISABLED (using matrix-clean.js instead)
    startMatrixRain() {
        // Disabled to prevent conflicts with matrix-clean.js
        console.log('Matrix rain disabled - using matrix-clean.js instead');
        return;
        
        /* DISABLED CODE:
        const matrix = document.querySelector('.matrix-bg');
        if (!matrix) return;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columns = Math.floor(window.innerWidth / 20);
        const drops = [];
        
        // Initialize drops
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        matrix.innerHTML = '';
        
        const rain = setInterval(() => {
            matrix.innerHTML = '';
            
            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const span = document.createElement('span');
                span.textContent = char;
                span.style.position = 'absolute';
                span.style.left = i * 20 + 'px';
                span.style.top = drops[i] * 20 + 'px';
                span.style.color = '#00ff41';
                span.style.fontSize = '16px';
                span.style.fontFamily = 'monospace';
                span.style.opacity = Math.random();
                
                matrix.appendChild(span);
                
                if (drops[i] * 20 > window.innerHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 50);
        
        // Stop after 10 seconds
        setTimeout(() => {
            clearInterval(rain);
            matrix.innerHTML = '';
        }, 10000);
        */
    }
    
    // CRT monitor effect
    applyCRTEffect() {
        const style = document.createElement('style');
        style.textContent = `
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 2px,
                        rgba(0, 255, 65, 0.1) 2px,
                        rgba(0, 255, 65, 0.1) 4px
                    );
                pointer-events: none;
                z-index: 9999;
                animation: crt-flicker 0.15s infinite;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Electromagnetic interference effect
    startEMIEffect() {
        const emiOverlay = document.createElement('div');
        emiOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9997;
            pointer-events: none;
            background: radial-gradient(
                circle at ${Math.random() * 100}% ${Math.random() * 100}%,
                rgba(255, 255, 255, 0.05) 0%,
                transparent 50%
            );
            animation: emi-pulse 2s ease-in-out;
        `;
        
        document.body.appendChild(emiOverlay);
        
        setTimeout(() => {
            emiOverlay.remove();
        }, 2000);
    }
}

// Initialize glitch effects
document.addEventListener('DOMContentLoaded', () => {
    new GlitchEffects();
});

// Add custom CSS for EMI pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes emi-pulse {
        0% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.2); }
    }
`;
document.head.appendChild(style);

// Export for other scripts
window.GlitchEffects = GlitchEffects;
