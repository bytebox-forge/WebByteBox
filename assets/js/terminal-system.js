// ByteBox Terminal System - Boot Sequence and Interactive Terminal
// Focused on working terminal functionality

console.log('🚀 ByteBox Terminal System Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 DOM Loaded - Initializing Terminal...');
    
    // Initialize terminal components
    initBootSequence();
    initMiniTerminal();
    
    // Debug info
    console.log('✅ Terminal initialization complete');
});

// Boot Sequence Animation
function initBootSequence() {
    console.log('🖥️ Starting boot sequence...');
    
    const bootLines = document.querySelectorAll('.boot-line');
    const terminalBoot = document.getElementById('terminal-boot');
    const terminalWelcome = document.getElementById('terminal-welcome');
    
    if (!bootLines.length) {
        console.error('❌ Boot lines not found');
        return;
    }
    
    if (!terminalBoot || !terminalWelcome) {
        console.error('❌ Terminal elements not found');
        return;
    }
    
    console.log(`📝 Found ${bootLines.length} boot lines`);
    
    // Show boot lines with proper delays
    bootLines.forEach((line, index) => {
        const delay = parseInt(line.getAttribute('data-delay')) || (index * 500);
        
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
            line.style.transition = 'all 0.5s ease';
            console.log(`📟 Boot line ${index + 1} displayed`);
        }, delay);
    });
    
    // Calculate total boot time
    const delays = Array.from(bootLines).map(line => 
        parseInt(line.getAttribute('data-delay')) || 0
    );
    const totalBootTime = Math.max(...delays) + 1500; // Extra time for last line
    
    console.log(`⏱️ Total boot time: ${totalBootTime}ms`);
    
    // Transition to main terminal after boot
    setTimeout(() => {
        console.log('🔄 Transitioning to main terminal...');
        
        // Hide boot screen
        terminalBoot.style.opacity = '0';
        terminalBoot.style.transition = 'opacity 1s ease';
        
        setTimeout(() => {
            terminalBoot.style.display = 'none';
            terminalWelcome.style.display = 'flex';
            terminalWelcome.style.opacity = '0';
            
            // Fade in welcome screen
            setTimeout(() => {
                terminalWelcome.style.opacity = '1';
                terminalWelcome.style.transition = 'opacity 1s ease';
                console.log('✅ Terminal welcome screen active');
                
                // Animate ASCII art
                animateAsciiArt();
            }, 100);
        }, 1000);
    }, totalBootTime);
}

// ASCII Art Animation
function animateAsciiArt() {
    const asciiArt = document.getElementById('ascii-art');
    if (asciiArt) {
        asciiArt.style.opacity = '0';
        asciiArt.style.transform = 'translateY(20px)';
        asciiArt.style.transition = 'all 1.5s ease';
        
        setTimeout(() => {
            asciiArt.style.opacity = '1';
            asciiArt.style.transform = 'translateY(0)';
            console.log('🎨 ASCII art animated');
        }, 300);
    }
}

// Mini Terminal Widget
function initMiniTerminal() {
    console.log('📱 Initializing mini terminal...');
    
    const miniTerminal = document.getElementById('mini-terminal');
    const miniToggle = document.getElementById('mini-toggle');
    const miniBody = document.getElementById('mini-body');
    const miniInput = document.getElementById('mini-input');
    const miniOutput = document.getElementById('mini-output');
    
    if (!miniTerminal || !miniToggle || !miniBody || !miniInput || !miniOutput) {
        console.error('❌ Mini terminal elements not found');
        return;
    }
    
    console.log('✅ Mini terminal elements found');
    
    let isExpanded = false;
    
    // Toggle functionality
    miniToggle.addEventListener('click', () => {
        isExpanded = !isExpanded;
        console.log(`🔄 Mini terminal ${isExpanded ? 'expanded' : 'collapsed'}`);
        
        if (isExpanded) {
            miniBody.style.display = 'block';
            miniToggle.textContent = 'v';
            setTimeout(() => miniInput.focus(), 100);
        } else {
            miniBody.style.display = 'none';
            miniToggle.textContent = '>';
        }
    });
    
    // Terminal Commands
    const commands = {
        help: `🚀 ByteBox Terminal Commands:
┌─────────────────────────────────────┐
│ help     - Show this help menu      │
│ whoami   - About the operator       │
│ ls       - List directories         │
│ hack     - Access mainframe         │
│ matrix   - Follow the white rabbit  │
│ clear    - Clear terminal output    │
│ coffee   - Coffee status report     │
│ uptime   - System status            │
│ date     - Current system time      │
│ exit     - Close mini terminal      │
└─────────────────────────────────────┘`,
        
        whoami: `👨‍💻 System Operator: Mayor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: The Grid
🎯 Role: Digital Architect & Homelab Enthusiast  
⚡ Status: Caffeinated and Operational
🔧 Specialties: AI, Containers, Security Research
📡 Frequency: Always learning, always building`,
        
        ls: `📁 Directory Listing:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
drwxr-xr-x  lab-logs/     Homelab experiments & tutorials
drwxr-xr-x  modules/      Tools, scripts & automation  
drwxr-xr-x  payloads/     Security research & CTF writeups
drwx------  blackbox/     [CLASSIFIED] Experimental projects
-rw-r--r--  README.md     System documentation
-rw-------  secrets.txt   [ENCRYPTED]`,
        
        hack: `🚨 INITIATING MAINFRAME ACCESS...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
> Scanning network topology...        [OK]
> Bypassing security protocols...     [OK] 
> Elevating privileges...             [OK]
> Injecting payload...                [OK]
> Establishing backdoor...            [OK]

🎯 ACCESS GRANTED - Welcome to the MATRIX
"There is no spoon, only code" - Neo (probably)
Root access achieved. Happy hacking! 😎`,
        
        matrix: `💊 THE MATRIX HAS YOU...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"This is your last chance. After this, 
there is no going back."

🔴 Red pill  - See how deep the rabbit hole goes
🔵 Blue pill - Return to blissful ignorance

Choose wisely, Neo... The truth awaits.
Follow the white rabbit 🐰`,
        
        clear: 'CLEAR',
        
        coffee: `☕ COFFEE STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Current Level:    MAXIMUM OVERDRIVE ████████████ 100%
Cups Today:       42 (and counting...)
Preferred Method: Cold brew + pure determination
Side Effects:     Enhanced coding abilities
Status:           JITTERY BUT PRODUCTIVE 🚀
Next Refill:      Imminent`,
        
        uptime: `⚡ SYSTEM STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Uptime:           1337 days, 42 hours, 7 minutes
Load Average:     Optimal performance
Memory Usage:     More RAM = More browser tabs
Network:          Connected to The Grid
Coffee Levels:    Dangerously low
Status:           ALL SYSTEMS OPERATIONAL 🟢`,
        
        date: `📅 SYSTEM TIME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${new Date().toLocaleString()}
Stardate: ${Math.floor(Math.random() * 10000)}.${Math.floor(Math.random() * 10)}
Time Zone: Hacker Standard Time (HST)
Coffee Time: Always ☕`,
        
        exit: 'EXIT'
    };
    
    // Handle terminal input
    miniInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = miniInput.value.trim().toLowerCase();
            console.log(`💻 Command entered: ${command}`);
            
            // Add command to output
            addToOutput(`<span style="color: var(--neon-green);">mayor@bytebox:~$</span> ${command}`);
            
            // Execute command
            if (commands[command]) {
                if (command === 'clear') {
                    miniOutput.innerHTML = '<p>🚀 ByteBox Terminal v2.0 - Type "help" for commands</p>';
                    console.log('🧹 Terminal cleared');
                } else if (command === 'exit') {
                    isExpanded = false;
                    miniBody.style.display = 'none';
                    miniToggle.textContent = '>';
                    console.log('👋 Mini terminal closed');
                } else {
                    addToOutput(commands[command]);
                }
            } else {
                addToOutput(`<span style="color: var(--red);">Command not found: ${command}</span>`);
                addToOutput(`Type "help" for available commands.`);
            }
            
            // Clear input
            miniInput.value = '';
        }
    });
    
    // Add output to terminal
    function addToOutput(text) {
        const outputDiv = document.createElement('div');
        if (text.includes('━') || text.includes('┌') || text.includes('│')) {
            // Preserve formatting for ASCII boxes
            outputDiv.innerHTML = `<pre style="margin: 0; font-family: inherit; white-space: pre-wrap;">${text}</pre>`;
        } else {
            outputDiv.innerHTML = `<p style="margin: 0.25rem 0;">${text}</p>`;
        }
        miniOutput.appendChild(outputDiv);
        
        // Scroll to bottom
        miniOutput.scrollTop = miniOutput.scrollHeight;
        
        // Limit output length
        const children = miniOutput.children;
        if (children.length > 100) {
            for (let i = 0; i < 20; i++) {
                if (children[i]) children[i].remove();
            }
        }
    }
    
    // Auto-show terminal hint after page loads
    setTimeout(() => {
        if (!isExpanded) {
            miniTerminal.style.animation = 'pulse 1s ease-in-out 3';
            console.log('💡 Mini terminal hint displayed');
        }
    }, 10000); // Show hint after 10 seconds
}

// Konami Code Easter Egg
let konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.shift();
    }
    
    if (konamiSequence.length === konamiCode.length && 
        konamiSequence.every((code, index) => code === konamiCode[index])) {
        
        console.log('🎮 KONAMI CODE ACTIVATED!');
        
        // Visual effect
        document.body.style.filter = 'hue-rotate(180deg) saturate(1.5)';
        
        // Add message to mini terminal if available
        const miniOutput = document.getElementById('mini-output');
        if (miniOutput) {
            const konamiMsg = document.createElement('div');
            konamiMsg.innerHTML = `
                <p style="color: var(--neon-green); text-align: center; font-weight: bold;">
                🎉 KONAMI CODE ACTIVATED! 🎉
                </p>
                <p style="text-align: center;">
                Welcome to the secret level, hacker!<br>
                Type "matrix" to reset colors.
                </p>
            `;
            miniOutput.appendChild(konamiMsg);
            miniOutput.scrollTop = miniOutput.scrollHeight;
            
            // Auto-expand terminal to show message
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

// Add some visual polish
setTimeout(() => {
    // Random glitch effect on ASCII art
    const asciiArt = document.getElementById('ascii-art');
    if (asciiArt) {
        setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance every 3 seconds
                asciiArt.style.textShadow = '2px 0 var(--red), -2px 0 var(--amber)';
                setTimeout(() => {
                    asciiArt.style.textShadow = '0 0 5px var(--neon-green-glow)';
                }, 150);
            }
        }, 3000);
    }
}, 8000);

console.log('🎯 ByteBox Terminal System Ready!');
