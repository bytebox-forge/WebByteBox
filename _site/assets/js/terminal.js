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
        this.setupTerminalCommands();
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
    
    playTypingSound() {
        // Placeholder for typing sound effect
        // Could be expanded to play actual sound files if needed
        return;
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
        // Interactive terminal functionality
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
    
    setupTerminalCommands() {
        this.commands = {
            help: () => this.showHelp(),
            ls: () => this.listDirectory(),
            cat: (args) => this.catFile(args),
            whoami: () => this.whoami(),
            uptime: () => this.showUptime(),
            ps: () => this.showProcesses(),
            neofetch: () => this.showSystemInfo(),
            clear: () => this.clearTerminal(),
            matrix: () => this.startMatrix(),
            hack: () => this.easterEggHack(),
            coffee: () => this.brewCoffee(),
            pwd: () => this.showCurrentDir(),
            date: () => this.showDate(),
            fortune: () => this.showFortune(),
            konami: () => this.konamiCode(),
            sudo: (args) => this.sudoCommand(args),
            rm: (args) => this.rmCommand(args),
            exit: () => this.exitCommand(),
            history: () => this.showHistory(),
            cowsay: (args) => this.cowsay(args),
            sl: () => this.steamLocomotive()
        };
    }
      processCommand(command, prompt) {
        // Basic terminal command processing
        const [commandName, ...args] = command.trim().split(' ');
        
        if (this.commands[commandName]) {
            const result = this.commands[commandName](args);
            prompt.innerHTML += `<div class="command-result">${result}</div>`;
        } else if (commandName.trim() === '') {
            // Empty command, just add new prompt
            return;
        } else {
            prompt.innerHTML += `<div class="command-error">bash: ${commandName}: command not found</div>`;
        }
        
        // Add new prompt
        this.addNewPrompt(prompt.parentElement);
    }
      showHelp() {
        return `<div class="help-output">
Available commands:
<span class="command-name">help</span>     - Show this help message
<span class="command-name">ls</span>       - List directory contents  
<span class="command-name">cat</span>      - Display file contents
<span class="command-name">whoami</span>   - Display current user
<span class="command-name">uptime</span>   - Show system uptime
<span class="command-name">ps</span>       - Show running processes
<span class="command-name">neofetch</span> - Display system information
<span class="command-name">clear</span>    - Clear terminal
<span class="command-name">matrix</span>   - Toggle matrix effect
<span class="command-name">pwd</span>      - Show current directory
<span class="command-name">date</span>     - Show current date/time
<span class="command-name">fortune</span>  - Get a random quote
<span class="command-name">coffee</span>   - Brew virtual coffee ☕
<span class="command-name">history</span>  - Show command history
<span class="command-name">cowsay</span>   - Make the cow say something
<span class="command-name">sl</span>       - Steam locomotive
<span class="command-name">sudo</span>     - Pretend to be root
<span class="command-name">rm</span>       - Safely pretend to delete
<span class="command-name">exit</span>     - Say goodbye
<span class="command-name">konami</span>   - Secret code
<span class="command-name">hack</span>     - ¯\\_(ツ)_/¯

<span class="hint">💡 Tip: Try typing 'konami' for a surprise!</span>
</div>`;
    }

    listDirectory() {
        return `<div class="ls-output">
<span class="dir-entry">drwxr-xr-x  root  bytebox   4096  Jun 21 15:42  <a href="/WebByteBox/about/" class="neon-green">whoami/</a></span>
<span class="dir-entry">drwxr-xr-x  root  bytebox   4096  Jun 21 15:42  <a href="/WebByteBox/projects.html" class="amber">projects/</a></span>
<span class="dir-entry">drwxr-xr-x  root  bytebox   4096  Jun 21 15:42  <a href="/WebByteBox/archives.html" class="purple">archives/</a></span>
<span class="dir-entry">drwxr-xr-x  root  bytebox   2048  Jun 21 15:42  <a href="/WebByteBox/lab-logs/" class="amber">lab-logs/</a></span>
<span class="dir-entry">drwxr-xr-x  root  bytebox   2048  Jun 21 15:42  <a href="/WebByteBox/modules/" class="purple">modules/</a></span>
<span class="dir-entry">-rwxr-xr-x  root  bytebox   1337  Jun 21 15:42  <span class="filename">README.md</span></span>
<span class="dir-entry">-rw-r--r--  root  bytebox    666  Jun 21 15:42  <span class="filename">.secrets</span></span>
</div>`;
    }

    catFile(args) {
        if (!args || args.length === 0) {
            return '<span class="error">cat: missing file operand</span>';
        }
        
        const filename = args[0];
        const files = {
            'README.md': `# Byte Box - Digital Underground
Welcome to my cyberpunk homelab documentation.
Current status: Probably on fire 🔥
Coffee level: Critical ⚠️`,
            '.secrets': `ACCESS_DENIED
[CLASSIFIED]
Nice try, script kiddie 😏`,
            'motd': `Welcome to ByteBox Terminal
System Status: ${Math.random() > 0.5 ? 'OPTIMAL' : 'CHAOTIC'}
Current Projects: ${Math.floor(Math.random() * 42) + 1}
Uptime: Too long`
        };
        
        return files[filename] || `<span class="error">cat: ${filename}: No such file or directory</span>`;
    }

    whoami() {
        return `<span class="user-info">mayor@bytebox</span>
<span class="user-desc">Digital architect, coffee addict, professional chaos engineer</span>`;
    }

    showUptime() {
        const startDate = new Date('2024-01-01');
        const now = new Date();
        const uptime = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
        return `System up ${uptime} days, load average: 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(Math.random() * 99)}, 0.${Math.floor(Math.random() * 99)}`;
    }

    showProcesses() {
        const processes = [
            'PID   USER      %CPU  %MEM  COMMAND',
            '1337  mayor     23.4   8.2  /usr/bin/coffee-daemon',
            '1338  mayor     45.7  12.1  docker-compose up',
            '1339  root       2.1   4.5  nginx: master process',
            '1340  mayor     78.9  16.8  node homelab-monitor.js',
            '1341  mayor      0.1   2.1  vim endless-configs.yml'
        ];
        return processes.join('\n');
    }

    showSystemInfo() {
        return `<div class="neofetch-output">
<span class="ascii-logo">     ___</span>    <span class="system-info">mayor@bytebox</span>
<span class="ascii-logo">    (.. |</span>    <span class="separator">--------------</span>
<span class="ascii-logo">    (<> |</span>    <span class="info-line"><span class="label">OS:</span> ByteBox Linux</span>
<span class="ascii-logo">   / __  \\</span>   <span class="info-line"><span class="label">Kernel:</span> 6.6.6-cyberpunk</span>
<span class="ascii-logo">  ( /  \\ /|</span>  <span class="info-line"><span class="label">Uptime:</span> ${Math.floor(Math.random() * 365)} days</span>
<span class="ascii-logo"> _/\\ __)/_)</span>  <span class="info-line"><span class="label">Shell:</span> bash 5.1.16</span>
<span class="ascii-logo">\\___))_))</span>   <span class="info-line"><span class="label">Terminal:</span> WebTerminal</span>
</div>`;
    }
    
    clearTerminal() {
        // Clear terminal content
        setTimeout(() => {
            const terminalContent = document.querySelector('.terminal-content');
            if (terminalContent) {
                terminalContent.innerHTML = '<div class="prompt">mayor@bytebox:~$ </div>';
            }
        }, 100);
        return '';
    }
    
    startMatrix() {
        // Toggle matrix effect
        if (window.matrixEffect) {
            window.matrixEffect.toggle();
            return '<span class="matrix-msg">Matrix effect toggled</span>';
        }
        return '<span class="error">Matrix module not loaded</span>';
    }
    
    easterEggHack() {
        const responses = [
            'Access denied. Nice try, Neo.',
            'Initiating countermeasures... Just kidding.',
            'This is not the backdoor you are looking for.',
            'Error 418: I\'m a teapot',
            'sudo make me a sandwich',
            'The Matrix has you...',
            'Try harder, script kiddie.',
            '01001000 01100001 01100011 01101011 01100101 01110010'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    brewCoffee() {
        return `<div class="coffee-brewing">
Brewing coffee... ☕
[████████████████████] 100%
Coffee ready! Caffeine levels restored.
Warning: May cause excessive productivity.
</div>`;
    }
    
    showCurrentDir() {
        return '/home/mayor/bytebox';
    }
    
    showDate() {
        return new Date().toString();
    }
    
    showFortune() {
        const fortunes = [
            "The best way to predict the future is to implement it.",
            "There are only 10 types of people: those who understand binary and those who don't.",
            "It works on my machine.",
            "Code never lies, comments sometimes do.",
            "In sudo we trust.",
            "Coffee: A liquid solution to debugging problems.",
            "Real programmers count from 0.",
            "Talk is cheap. Show me the code."
        ];
        return fortunes[Math.floor(Math.random() * fortunes.length)];
    }
    
    konamiCode() {
        return `<div class="konami-output">
🎮 Konami Code Activated!
┌─────────────────────────────────┐
│  ↑ ↑ ↓ ↓ ← → ← → B A START      │
│  You found the secret!          │
│  +30 Hacker Points             │
└─────────────────────────────────┘
<span class="secret-msg">Matrix mode ENHANCED! 🔥</span>
</div>`;
    }

    sudoCommand(args) {
        if (!args || args.length === 0) {
            return '<span class="error">sudo: command not specified</span>';
        }
        
        const responses = [
            'sudo: access granted. Just kidding, this is a web browser.',
            'sudo: Nice try, but you\'re not root here.',
            '[sudo] password for mayor: ●●●●●●●● (Access Denied)',
            'sudo: This incident will be reported to Santa.',
            'sudo: With great power comes great electricity bill.'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    rmCommand(args) {
        if (args && args.includes('-rf')) {
            return `<div class="danger-output">
⚠️  WARNING: rm -rf detected!
Launching protective protocols...
[████████████████████] 100%
✅ System protected by common sense.
Nothing was actually deleted, but nice try!
</div>`;
        }
        return 'rm: missing operand. (Also, this doesn\'t actually delete anything)';
    }

    exitCommand() {
        return `<div class="exit-output">
Goodbye, brave hacker! 👋
Session terminated.
<span class="subtle">Tip: There is no escape from the Matrix...</span>
</div>`;
    }

    showHistory() {
        const history = [
            'ls -la',
            'cat /etc/passwd',
            'sudo apt update',
            'docker ps',
            'git commit -m "fix everything"',
            'rm -rf node_modules',
            'npm install',
            'coffee --verbose',
            'ping google.com',
            'whoami'
        ];
        
        return history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n');
    }

    cowsay(args) {
        const message = args && args.length > 0 ? args.join(' ') : 'Hello ByteBox!';
        return `<div class="cowsay-output">
 ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
</div>`;
    }

    steamLocomotive() {
        return `<div class="sl-output">
      (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O
     (@@@)
 (    )
  (@@@@)

(    )
@@)  (@@
🚂💨💨💨  CHOO CHOO!
The train has departed. All aboard the hype train!
</div>`;
    }

    addNewPrompt(outputElement) {
        const promptLine = document.createElement('div');
        promptLine.className = 'prompt-line';
        promptLine.innerHTML = '<span class="prompt">mayor@bytebox:~$ </span><span class="cursor">█</span>';
        outputElement.appendChild(promptLine);
        
        // Make new prompt interactive
        this.makePromptInteractive(promptLine);
    }
    
    makePromptInteractive(promptElement) {
        promptElement.addEventListener('click', () => {
            const existing = promptElement.querySelector('input');
            if (existing) return;
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'terminal-input';
            input.style.cssText = `
                background: transparent;
                border: none;
                color: var(--neon-green);
                font-family: var(--font-mono);
                font-size: inherit;
                outline: none;
                width: 300px;
                margin-left: 5px;
            `;
            
            const cursor = promptElement.querySelector('.cursor');
            cursor.style.display = 'none';
            promptElement.appendChild(input);
            input.focus();
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const command = input.value;
                    input.remove();
                    cursor.style.display = 'inline';
                    
                    // Show command in terminal
                    promptElement.innerHTML = `<span class="prompt">mayor@bytebox:~$ </span>${command}`;
                    
                    // Execute command
                    this.executeCommand(command, promptElement.parentElement);
                }
            });
            
            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.remove();
                    cursor.style.display = 'inline';
                }
            });
        });
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
          // Add matrix rain effect - DISABLED (using matrix-clean.js instead)
        // const matrix = document.querySelector('.matrix-bg');
        // if (matrix) {
        //     matrix.style.opacity = '0.3';
        //     matrix.innerHTML = generateMatrixRain();
        // }
        
        // Show secret message
        console.log('🎉 Konami Code activated! Welcome, fellow hacker.');
          // Reset after 10 seconds
        setTimeout(() => {
            document.body.style.filter = '';
            // Matrix reset disabled - using matrix-clean.js instead
            // if (matrix) {
            //     matrix.style.opacity = '0.05';
            // }
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
