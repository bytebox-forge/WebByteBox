// Homepage Interactive Features
// Stats counter animation, terminal widget, and scroll effects

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all homepage features
    initStatsCounter();
    initTerminalWidget();
    initScrollAnimations();
    initSkillBars();
});

// Animated Stats Counter
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Terminal Widget Functionality
function initTerminalWidget() {
    const widget = document.getElementById('terminal-widget');
    const toggle = document.getElementById('terminal-toggle');
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    
    if (!widget || !toggle || !input || !output) return;
    
    let isExpanded = false;
    
    // Toggle widget
    toggle.addEventListener('click', () => {
        isExpanded = !isExpanded;
        widget.classList.toggle('expanded', isExpanded);
        toggle.textContent = isExpanded ? '−' : '_';
        
        if (isExpanded) {
            setTimeout(() => input.focus(), 300);
        }
    });
    
    // Terminal commands
    const commands = {
        help: 'Available commands: help, whoami, ls, hack, matrix, clear, skills, projects',
        whoami: 'guest@bytebox - Welcome to the digital underground! 🏴‍☠️',
        ls: '📁 lab-logs/\n📁 modules/\n📁 payloads/\n📁 blackbox/\n📄 README.md\n📄 SECRETS.txt [ENCRYPTED]',
        hack: '🚨 ACCESSING MAINFRAME...\n> LOGIN: root\n> PASSWORD: *******\n> ACCESS GRANTED\n> Welcome to the MATRIX, Neo... 😎',
        matrix: 'Wake up, Neo... The Matrix has you. 💊\nFollow the white rabbit. 🐰',
        clear: '',
        skills: '🔧 Infrastructure: 90%\n💻 Development: 85%\n🛡️ Security: 80%\n🧠 Coffee Dependency: 100%',
        projects: '🚀 Current Projects:\n• Kubernetes Homelab\n• AI Security Scanner\n• Blockchain Explorer\n• Quantum Encryption Tool'
    };
    
    // Handle terminal input
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = input.textContent.trim().toLowerCase();
            
            // Add command to output
            const commandLine = document.createElement('p');
            commandLine.innerHTML = `<span style="color: var(--neon-green)">guest@bytebox:~$</span> ${command}`;
            output.appendChild(commandLine);
            
            // Execute command
            const response = document.createElement('div');
            if (commands[command]) {
                if (command === 'clear') {
                    output.innerHTML = '<p>Terminal cleared. Type "help" for available commands.</p>';
                } else {
                    response.innerHTML = commands[command].split('\n').map(line => `<p>${line}</p>`).join('');
                    output.appendChild(response);
                }
            } else {
                response.innerHTML = `<p style="color: var(--red)">Command not found: ${command}</p><p>Type "help" for available commands.</p>`;
                output.appendChild(response);
            }
            
            // Clear input and scroll to bottom
            input.textContent = '';
            output.scrollTop = output.scrollHeight;
        }
    });
    
    // Prevent default behavior and focus management
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text');
        input.textContent = text;
    });
}

// Scroll-based Animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll, .access-card, .featured-card, .skill-category');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Stagger animation for grid items
                if (entry.target.closest('.access-grid, .featured-grid, .skills-grid')) {
                    const siblings = [...entry.target.parentElement.children];
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger CSS animation by adding a class
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Matrix Background Effect (if canvas exists)
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize matrix background if needed
if (document.getElementById('matrix-canvas')) {
    initMatrixBackground();
}

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg)';
        
        // Show congratulations message
        const message = document.createElement('div');
        message.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: var(--terminal-bg); border: 2px solid var(--neon-green); 
                        padding: 2rem; border-radius: 10px; z-index: 10000; text-align: center;">
                <h2 style="color: var(--neon-green); margin-bottom: 1rem;">🎉 KONAMI CODE ACTIVATED! 🎉</h2>
                <p style="color: var(--terminal-text);">Welcome to the secret level, fellow hacker!</p>
                <button onclick="this.parentElement.parentElement.remove(); document.body.style.filter = 'none';" 
                        style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--neon-green); 
                               border: none; color: var(--bg-black); border-radius: 5px; cursor: pointer;">
                    Reset Matrix
                </button>
            </div>
        `;
        document.body.appendChild(message);
        
        konamiCode = []; // Reset
    }
});
