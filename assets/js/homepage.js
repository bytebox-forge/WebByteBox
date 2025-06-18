// Hybrid Homepage Interactive Features
// Terminal boot sequence, navigation, and mini terminal

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all homepage features
    initTerminalBoot();
    initMiniTerminal();
});

// Terminal Boot Sequence
function initTerminalBoot() {
    const bootLines = document.querySelectorAll('.boot-line');
    const terminalBoot = document.getElementById('terminal-boot');
    const terminalWelcome = document.getElementById('terminal-welcome');
    
    if (!bootLines.length || !terminalBoot || !terminalWelcome) return;
    
    // Animate boot lines with delays
    bootLines.forEach((line, index) => {
        const delay = parseInt(line.getAttribute('data-delay')) || index * 500;
        
        setTimeout(() => {
            line.style.animationDelay = '0s';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, delay);
    });
    
    // Show terminal welcome after boot sequence
    const totalBootTime = Math.max(...Array.from(bootLines).map(line => 
        parseInt(line.getAttribute('data-delay')) || 0
    )) + 1000;
    
    setTimeout(() => {
        terminalBoot.style.display = 'none';
        terminalWelcome.style.display = 'flex';
        
        // Animate ASCII art appearance
        const asciiArt = document.getElementById('ascii-art');
        if (asciiArt) {
            asciiArt.style.opacity = '0';
            asciiArt.style.transform = 'translateY(20px)';
            asciiArt.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                asciiArt.style.opacity = '1';
                asciiArt.style.transform = 'translateY(0)';
            }, 100);
        }
    }, totalBootTime);
}

// Mini Terminal Widget
function initMiniTerminal() {
    const miniTerminal = document.getElementById('mini-terminal');
    const miniToggle = document.getElementById('mini-toggle');
    const miniBody = document.getElementById('mini-body');
    const miniInput = document.getElementById('mini-input');
    const miniOutput = document.getElementById('mini-output');
    
    if (!miniTerminal || !miniToggle || !miniBody || !miniInput || !miniOutput) return;
    
    let isExpanded = false;
    
    // Toggle mini terminal
    miniToggle.addEventListener('click', () => {
        isExpanded = !isExpanded;
        miniBody.style.display = isExpanded ? 'block' : 'none';
        miniToggle.textContent = isExpanded ? 'v' : '>';
        
        if (isExpanded) {
            setTimeout(() => miniInput.focus(), 100);
        }
    });
    
    // Terminal commands
    const commands = {
        help: `🚀 ByteBox Terminal Commands:
• help - Show this help
• whoami - About the operator
• ls - List available sections
• hack - Access the mainframe
• matrix - Follow the white rabbit
• clear - Clear terminal
• coffee - Essential fuel info
• uptime - System status`,
        
        whoami: `👨‍💻 Mayor - Digital Architect
• Location: The Grid
• Role: Homelab Enthusiast & Problem Solver
• Status: Caffeinated and Ready
• Interests: AI, Containers, Security Research`,
        
        ls: `📁 Available Sections:
• lab-logs/ - Homelab experiments
• modules/ - Tools & scripts  
• payloads/ - Security research
• blackbox/ - Classified projects
• about/ - About the operator
• contact/ - Communication channels`,
        
        hack: `🚨 ACCESSING MAINFRAME...
> Bypassing security protocols...
> Elevation successful
> Welcome to the MATRIX, Mayor
> "There is no spoon" - Remember that
> Access Level: ROOT 😎`,
        
        matrix: `💊 Choose your pill:
🔴 Take the red pill - See how deep the rabbit hole goes
🔵 Take the blue pill - Return to the ordinary world
"This is your last chance. After this, there is no going back."`,
        
        clear: '',
        
        coffee: `☕ Coffee Status Report:
• Current Level: MAXIMUM OVERDRIVE
• Cups Today: 42
• Preferred Method: Cold Brew + Determination
• Status: JITTERY BUT PRODUCTIVE 🚀`,
        
        uptime: `⚡ System Status:
• Uptime: 1337 days, 42 hours, 7 minutes
• CPU Usage: Optimal
• Memory: More RAM = More Tabs
• Network: Connected to The Grid
• Status: ALL SYSTEMS GO 🟢`
    };
    
    // Handle terminal input
    miniInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = miniInput.value.trim().toLowerCase();
            
            // Add command to output
            const commandLine = document.createElement('p');
            commandLine.innerHTML = `<span style="color: var(--neon-green);">$</span> ${command}`;
            miniOutput.appendChild(commandLine);
            
            // Execute command
            const response = document.createElement('div');
            if (commands[command]) {
                if (command === 'clear') {
                    miniOutput.innerHTML = '<p>🚀 ByteBox Terminal v2.0 - Type "help" for commands</p>';
                } else {
                    response.innerHTML = commands[command].split('\n').map(line => `<p>${line}</p>`).join('');
                    miniOutput.appendChild(response);
                }
            } else {
                response.innerHTML = `<p style="color: var(--red);">Command not found: ${command}</p><p>Type "help" for available commands.</p>`;
                miniOutput.appendChild(response);
            }
            
            // Clear input and scroll to bottom
            miniInput.value = '';
            miniOutput.scrollTop = miniOutput.scrollHeight;
            
            // Limit output length
            const outputs = miniOutput.querySelectorAll('p, div');
            if (outputs.length > 50) {
                for (let i = 0; i < 10; i++) {
                    outputs[i].remove();
                }
            }
        }
    });
    
    // Auto-show terminal after welcome screen loads
    setTimeout(() => {
        if (!isExpanded) {
            // Subtle pulse to attract attention
            miniTerminal.style.animation = 'pulse 2s ease-in-out 3';
        }
    }, 8000);
}

// Smooth scrolling for internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add subtle animations to nav items on hover
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('.nav-icon');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('.nav-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Easter egg: Konami code
let konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.length === konamiCode.length && 
        konamiSequence.every((code, index) => code === konamiCode[index])) {
        
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
        
        // Show message in mini terminal
        const miniOutput = document.getElementById('mini-output');
        if (miniOutput) {
            const message = document.createElement('p');
            message.innerHTML = '🎉 <span style="color: var(--neon-green);">KONAMI CODE ACTIVATED!</span> 🎉';
            miniOutput.appendChild(message);
            
            const resetMsg = document.createElement('p');
            resetMsg.innerHTML = 'Type "matrix" to reset or enjoy the new colors!';
            miniOutput.appendChild(resetMsg);
            
            // Expand mini terminal if not expanded
            const miniBody = document.getElementById('mini-body');
            const miniToggle = document.getElementById('mini-toggle');
            if (miniBody && miniToggle && miniBody.style.display === 'none') {
                miniBody.style.display = 'block';
                miniToggle.textContent = 'v';
            }
        }
        
        konamiSequence = []; // Reset
    }
});

// Add some dynamic elements
setTimeout(() => {
    // Add random glitch effect to ASCII art occasionally
    const asciiArt = document.getElementById('ascii-art');
    if (asciiArt) {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                asciiArt.style.textShadow = '2px 0 var(--red), -2px 0 var(--neon-green)';
                setTimeout(() => {
                    asciiArt.style.textShadow = '0 0 5px var(--neon-green-glow)';
                }, 100);
            }
        }, 3000);
    }
}, 5000);
