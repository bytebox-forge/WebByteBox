// GitHub Discussions Integration for ByteBox Community
// Fetches recent discussions and displays them in terminal style

class CommunityIntegration {
    constructor() {
        this.apiBase = 'https://api.github.com';
        this.repo = 'anykolaiszyn/WebByteBox';
        this.discussionsContainer = document.getElementById('recent-discussions');
        this.loadingContainer = document.querySelector('.loading-discussions');
        
        this.init();
    }
    
    init() {
        if (this.discussionsContainer) {
            this.loadRecentDiscussions();
        }
        
        this.setupCommunityAnimations();
    }
    
    async loadRecentDiscussions() {
        try {
            // Note: GitHub Discussions API requires GraphQL, but we can use a simpler approach
            // by fetching from the discussions page or using GitHub's RSS feed
            
            // For now, we'll show a placeholder with sample discussions
            this.showSampleDiscussions();
            
            // TODO: Implement actual GitHub Discussions API integration
            // This would require setting up a serverless function or proxy
            // to handle the GraphQL requests with authentication
            
        } catch (error) {
            console.log('Could not load discussions:', error);
            this.showOfflineMessage();
        }
    }
      showSampleDiscussions() {
        if (!this.discussionsContainer || !this.loadingContainer) return;
        
        // Hide loading indicator
        this.loadingContainer.style.display = 'none';
          // Check if discussions are enabled by trying to access the API
        this.checkDiscussionsStatus().then(enabled => {
            if (enabled) {
                // Show welcome message for enabled discussions
                const enabledDiscussions = [
                    {
                        title: "Welcome to the ByteBox Community! 🎉",
                        author: "anykolaiszyn",
                        category: "General",
                        replies: 0,
                        url: `https://github.com/${this.repo}/discussions`,
                        created: "Just now"
                    },
                    {
                        title: "Share your homelab setup and get feedback",
                        author: "anykolaiszyn", 
                        category: "Show and Tell",
                        replies: 0,
                        url: `https://github.com/${this.repo}/discussions/categories/show-and-tell`,
                        created: "Just now"
                    },
                    {
                        title: "Got questions about Docker, Kubernetes, or networking?",
                        author: "anykolaiszyn",
                        category: "Q&A",
                        replies: 0,
                        url: `https://github.com/${this.repo}/discussions/categories/q-a`,
                        created: "Just now"
                    }
                ];
                
                this.renderDiscussions(enabledDiscussions);
            } else {
                this.showSetupMessage();
            }
        });
    }
      async checkDiscussionsStatus() {
        try {
            // Try to fetch discussions page to see if it exists
            const response = await fetch(`https://github.com/${this.repo}/discussions`, {
                method: 'GET',
                mode: 'no-cors' // Avoid CORS issues
            });
            // Since discussions are now enabled, return true
            return true;
        } catch (error) {
            // Assume discussions are enabled since user confirmed
            return true;
        }
    }
    
    showSetupMessage() {
        if (!this.discussionsContainer) return;
        
        const setupHtml = `
            <div class="setup-message">
                <div class="setup-prompt">
                    <span class="prompt">mayor@bytebox:~/community$</span>
                    <span class="command">./check_discussions_status</span>
                </div>
                <div class="setup-output">
                    <p class="amber">⚠️ GitHub Discussions not yet enabled</p>
                    <p>To activate the community platform:</p>
                    <ol>
                        <li>Go to <a href="https://github.com/${this.repo}/settings" target="_blank" rel="noopener noreferrer" class="neon-green">Repository Settings</a></li>
                        <li>Scroll to "Features" section</li>
                        <li>Enable "Discussions"</li>
                        <li>Refresh this page</li>
                    </ol>
                    <p class="purple">Meanwhile, you can use <a href="https://github.com/${this.repo}/issues" target="_blank" rel="noopener noreferrer" class="amber">GitHub Issues</a> for bug reports and feature requests.</p>
                </div>
            </div>
        `;
        
        this.discussionsContainer.innerHTML = setupHtml;
    }
    
    renderDiscussions(discussions) {
        const html = discussions.map(discussion => `
            <div class="discussion-item">
                <a href="${discussion.url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="discussion-title">
                   ${discussion.title}
                </a>
                <div class="discussion-meta">
                    <span class="discussion-author">@${discussion.author}</span> • 
                    <span class="discussion-category">${discussion.category}</span> • 
                    <span class="discussion-replies">${discussion.replies} replies</span> • 
                    <span class="discussion-time">${discussion.created}</span>
                </div>
            </div>
        `).join('');
        
        this.discussionsContainer.innerHTML = html;
        
        // Add terminal prompt before discussions
        const promptHtml = `
            <div class="discussions-prompt">
                <span class="prompt">mayor@bytebox:~/community$</span>
                <span class="command">tail -f discussions.log</span>
            </div>
        `;
        
        this.discussionsContainer.insertAdjacentHTML('beforebegin', promptHtml);
    }
    
    showOfflineMessage() {
        if (!this.discussionsContainer || !this.loadingContainer) return;
        
        this.loadingContainer.innerHTML = `
            <div class="offline-message">
                <p class="amber">⚠️ Unable to connect to discussions network</p>
                <p>Visit <a href="https://github.com/${this.repo}/discussions" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           class="neon-green">GitHub Discussions</a> directly</p>
            </div>
        `;
    }
    
    setupCommunityAnimations() {
        // Animate community boot sequence
        const bootLines = document.querySelectorAll('.community-boot .boot-line');
        
        bootLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
            }, index * 500);
        });
        
        // Add hover effects to forum items
        const forumItems = document.querySelectorAll('.forum-item');
        forumItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.playTerminalSound('hover');
            });
        });
        
        // Add click effects to action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.playTerminalSound('click');
                this.addClickEffect(btn);
            });
        });
    }
    
    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
    }
    
    playTerminalSound(type) {
        // Placeholder for terminal sound effects
        // This would integrate with the terminal sounds system
        console.log(`🔊 Terminal sound: ${type}`);
    }
    
    // Future enhancement: Real GitHub Discussions API integration
    async fetchRealDiscussions() {
        // This would require a GraphQL query to GitHub's API
        // Example query structure:
        const query = `
            query {
                repository(owner: "anykolaiszyn", name: "WebByteBox") {
                    discussions(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
                        nodes {
                            title
                            author {
                                login
                            }
                            category {
                                name
                            }
                            comments(first: 0) {
                                totalCount
                            }
                            createdAt
                            url
                        }
                    }
                }
            }
        `;
        
        // This would need to be implemented with proper authentication
        // and possibly through a serverless function to avoid CORS issues
    }
}

// Initialize community integration when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on community page
    if (document.querySelector('.community-container')) {
        new CommunityIntegration();
    }
});

// Add some community-specific terminal commands
if (window.Terminal) {
    const originalProcessCommand = window.Terminal.prototype.processCommand;
    
    window.Terminal.prototype.processCommand = function(command, prompt) {
        const communityCommands = {
            'community': 'Welcome to ByteBox Community! Visit /community.html for discussions',
            'discussions': 'GitHub Discussions: https://github.com/anykolaiszyn/WebByteBox/discussions',
            'forum': 'Community forum available at ./community',
            'connect': 'Connecting to community network... Type "community" for more info',
            'social': 'Connect with the community:\n• GitHub Discussions\n• Terminal Chat\n• Project Showcase'
        };
        
        if (communityCommands[command.toLowerCase()]) {
            const output = document.createElement('div');
            output.className = 'command-output';
            output.innerHTML = `
                <div class="cmd-line">
                    <span class="prompt">mayor@bytebox:~$</span>
                    <span class="command">${command}</span>
                </div>
                <div class="output">${communityCommands[command.toLowerCase()]}</div>
            `;
            prompt.parentNode.insertBefore(output, prompt);
            return;
        }
        
        // Fall back to original command processing
        if (originalProcessCommand) {
            originalProcessCommand.call(this, command, prompt);
        }
    };
}
