// Terminal Enhancement JavaScript
// Handles typing effects, boot sequence, and terminal interactions

class Terminal {
    constructor() {
        this.bootSequence = document.getElementById('terminal-boot');
        this.welcomeSection = document.getElementById('terminal-welcome');
        this.navMenu = document.getElementById('nav-menu');
        this.quickAccess = document.getElementById('quick-access');
        this.currentStep = 0;
        this.isBooting = true;
        
        this.init();
    }
    
    init() {
        if (this.bootSequence) {
            this.startBootSequence();
        } else {
            // Skip boot on other pages
            this.showWelcome();
        }
        
        this.setupUptime();
        this.setupInteractivePrompt();
    }
    
    startBootSequence() {
        const bootLines = document.querySelectorAll('.boot-line');
        let delay = 0;
        
        bootLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.animation = 'fadeInUp 0.5s ease forwards';
                
                // Add typing sound effect (optional)
                this.playTypingSound();
                
                // After last line, show welcome
                if (index === bootLines.length - 1) {
                    setTimeout(() => {
                        this.showWelcome();
                    }, 1000);
                }
            }, delay);
            
            delay += 500;
        });
    }
    
    showWelcome() {
        if (this.bootSequence) {
            this.bootSequence.style.opacity = '0';
            setTimeout(() => {
                this.bootSequence.style.display = 'none';
            }, 500);
        }
        
        if (this.welcomeSection) {
            this.welcomeSection.style.display = 'block';
            this.welcomeSection.style.opacity = '0';
            
            setTimeout(() => {
                this.welcomeSection.style.opacity = '1';
                this.startTypingEffect();
            }, 600);
        }
    }
    
    startTypingEffect() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        const text = typingElement.getAttribute('data-text');
        const speed = 50; // milliseconds per character
        let index = 0;
        
        typingElement.textContent = '';
        
        const typeWriter = () => {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing
                typingElement.classList.add('typed');
                
                // Show the output section
                setTimeout(() => {
                    this.showWelcomeOutput();
                }, 500);
            }
        };
        
        typeWriter();
    }
    
    showWelcomeOutput() {
        const output = document.getElementById('welcome-output');
        if (output) {
            output.style.display = 'block';
            output.style.animation = 'fadeInUp 0.7s ease forwards';
            
            setTimeout(() => {
                this.showNavMenu();
            }, 1500);
        }
    }
    
    showNavMenu() {
        if (this.navMenu) {
            this.navMenu.style.display = 'block';
            this.navMenu.style.animation = 'slideInLeft 0.6s ease forwards';
            
            setTimeout(() => {
                this.showQuickAccess();
            }, 800);
        }
    }
    
    showQuickAccess() {
        if (this.quickAccess) {
            this.quickAccess.style.display = 'block';
            this.quickAccess.style.animation = 'fadeIn 1s ease forwards';
        }
    }
    
    setupUptime() {
        const uptimeElement = document.getElementById('uptime-counter');
        if (!uptimeElement) return;
        
        // Calculate uptime since 2024 (or your site launch date)
        const launchDate = new Date('2024-01-01');
        const now = new Date();
        const diffTime = Math.abs(now - launchDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let hours = Math.floor(Math.random() * 24);
        let minutes = Math.floor(Math.random() * 60);
        
        uptimeElement.textContent = `${diffDays} days, ${hours}:${minutes.toString().padStart(2, '0')}`;
        
        // Update every minute
        setInterval(() => {
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
                if (hours >= 24) {
                    hours = 0;
                }
            }
            uptimeElement.textContent = `${diffDays} days, ${hours}:${minutes.toString().padStart(2, '0')}`;
        }, 60000);
    }
    
    setupInteractivePrompt() {
        const prompts = document.querySelectorAll('.command-prompt');
        
        prompts.forEach(prompt => {
            const cursor = prompt.querySelector('.cursor');
            if (cursor) {
                // Add random blinking interval for more realistic effect
                setInterval(() => {
                    cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
                }, 500 + Math.random() * 200);
            }
        });
        
        // Add click listener for interactive prompts
        prompts.forEach(prompt => {
            prompt.addEventListener('click', () => {
                this.focusPrompt(prompt);
            });
        });
    }
    
    focusPrompt(prompt) {
        // TODO: Add interactive terminal functionality
        console.log('Terminal prompt focused:', prompt);
        
        // Example: Create input field for commands
        const cursor = prompt.querySelector('.cursor');
        if (cursor && !prompt.querySelector('input')) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'terminal-input';
            input.style.background = 'transparent';
            input.style.border = 'none';
            input.style.color = 'var(--neon-green)';
            input.style.fontFamily = 'var(--font-mono)';
            input.style.fontSize = 'inherit';
            input.style.outline = 'none';
            input.style.width = '200px';
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.processCommand(input.value, prompt);
                    input.remove();
                }
            });
            
            input.addEventListener('blur', () => {
                input.remove();
            });
            
            cursor.parentNode.insertBefore(input, cursor);
            input.focus();
        }
    }
    
    processCommand(command, prompt) {
        // TODO: Implement basic terminal commands
        const commands = {
            'help': 'Available commands: help, ls, clear, whoami, date, uptime',
            'ls': 'lab-logs/  modules/  payloads/  blackbox/  whoami  contact',
            'clear': '', // Will be handled specially
            'whoami': 'root@bytebox',
            'date': new Date().toString(),
            'uptime': document.getElementById('uptime-counter')?.textContent || 'System operational',
            'pwd': '/home/bytebox',
            'ps': 'PID  CMD\n1337 ./homelab_expansion\n2048 docker-compose\n3141 ./learn_kubernetes'
        };
        
        const output = document.createElement('div');
        output.className = 'command-output';
        
        if (command === 'clear') {
            // Clear previous outputs
            const container = prompt.closest('.terminal-content');
            if (container) {
                const outputs = container.querySelectorAll('.command-output');
                outputs.forEach(out => out.remove());
            }
            return;
        }
        
        const response = commands[command.toLowerCase()] || `bash: ${command}: command not found`;
        
        output.innerHTML = `
            <div class="cmd-line">
                <span class="prompt">root@bytebox:~$</span>
                <span class="command">${command}</span>
            </div>
            <div class="output">${response}</div>
        `;
        
        prompt.parentNode.insertBefore(output, prompt);
        
        // Scroll to bottom
        prompt.scrollIntoView({ behavior: 'smooth' });
    }
    
    playTypingSound() {
        // TODO: Add subtle typing sound effect
        // This would require audio files and user permission
        try {
            // Example with Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (error) {
            // Silently fail if audio context is not available
        }
    }
    
    // Matrix-style text scramble effect
    scrambleText(element, finalText, duration = 1000) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const originalText = finalText;
        const length = originalText.length;
        let iteration = 0;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            if (iteration >= length) {
                clearInterval(interval);
            }
            
            iteration += 1 / 3;
        }, duration / length);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});

// Easter egg: Konami code
let konamiCode = [];
const konami = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konami.length);
    
    if (konamiCode.join('') === konami.join('')) {
        // Activate easter egg
        document.body.style.filter = 'hue-rotate(180deg)';
        
        // Add matrix rain effect
        const matrix = document.querySelector('.matrix-bg');
        if (matrix) {
            matrix.style.opacity = '0.3';
            matrix.innerHTML = generateMatrixRain();
        }
        
        // Show secret message
        console.log('🎉 Konami Code activated! Welcome, fellow hacker.');
        
        // Reset after 10 seconds
        setTimeout(() => {
            document.body.style.filter = '';
            if (matrix) {
                matrix.style.opacity = '0.05';
            }
        }, 10000);
        
        konamiCode = [];
    }
});

function generateMatrixRain() {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let result = '';
    
    for (let i = 0; i < 100; i++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        result += `<span class="matrix-char" style="position: absolute; left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 3}s;">${randomChar}</span>`;
    }
    
    return result;
}

// Export for other scripts
window.Terminal = Terminal;

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new Terminal();
});
