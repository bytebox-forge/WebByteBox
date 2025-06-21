// GitHub Discussions Integration for ByteBox Community
// Fetches recent discussions and displays them in terminal style

class CommunityIntegration {    constructor() {
        this.apiBase = 'https://api.github.com';
        this.orgDiscussions = 'https://github.com/orgs/bytebox-forge/discussions';
        this.repo = 'bytebox-forge/WebByteBox';
        this.discussionsContainer = document.getElementById('recent-discussions');
        this.loadingContainer = document.querySelector('.loading-discussions');
        
        this.init();
    }
    
    init() {
        if (this.discussionsContainer) {
            this.loadRecentDiscussions();
        }
        
        this.setupCommunityAnimations();
        this.setupEnhancedCommunity();
    }
    
    async loadRecentDiscussions() {
        try {
            // Note: GitHub Discussions API requires GraphQL, but we can use a simpler approach
            // by fetching from the discussions page or using GitHub's RSS feed
              // For now, we'll show a placeholder with sample discussions
            this.showSampleDiscussions();
            
            // Note: For production, implement GitHub Discussions API integration
            // This would require setting up a serverless function or proxy
            // to handle the GraphQL requests with authentication
            
        } catch (error) {
            console.log('Could not load discussions:', error);
            this.showOfflineMessage();
        }
    }    showSampleDiscussions() {
        if (!this.discussionsContainer || !this.loadingContainer) return;
        
        // Hide loading indicator
        this.loadingContainer.style.display = 'none';
        
        // Show welcome discussions for the live community
        const liveDiscussions = [
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
            },
            {
                title: "Feature ideas and suggestions for ByteBox",
                author: "anykolaiszyn",
                category: "Ideas", 
                replies: 0,
                url: `https://github.com/${this.repo}/discussions/categories/ideas`,
                created: "Just now"
            }
        ];
        
        this.renderDiscussions(liveDiscussions);
    }    renderDiscussions(discussions) {
        const html = discussions.map(discussion => `
            <div class="discussion-item" data-category="${discussion.category.toLowerCase()}">
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
    
    // Enhanced Community Features
    setupEnhancedCommunity() {
        this.setupLiveActivity();
        this.setupUserPresence();
        this.setupDiscussionFilters();
        this.setupNotifications();
    }

    setupLiveActivity() {
        // Simulate live community activity
        const activityFeed = document.getElementById('activity-feed');
        if (!activityFeed) return;

        const activities = [
            "mayor pushed new commits to homelab-configs",
            "anonymous-user starred WebByteBox repository",
            "hackerman opened discussion about Docker security",
            "caffeine-addict posted in #lab-logs channel",
            "digital-nomad joined the community",
            "bot-overlord updated monitoring alerts",
            "script-kiddie asked about Kubernetes setup",
            "privacy-advocate shared new security tools"
        ];

        let activityIndex = 0;
        setInterval(() => {
            this.addActivityToFeed(activities[activityIndex % activities.length]);
            activityIndex++;
        }, 30000); // New activity every 30 seconds
    }

    addActivityToFeed(activity) {
        const activityFeed = document.getElementById('activity-feed');
        if (!activityFeed) return;

        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        const timestamp = new Date().toLocaleTimeString();
        
        activityItem.innerHTML = `
            <span class="activity-time">[${timestamp}]</span>
            <span class="activity-text">${activity}</span>
        `;

        // Add to top of feed
        activityFeed.insertBefore(activityItem, activityFeed.firstChild);

        // Remove old items if too many
        const items = activityFeed.querySelectorAll('.activity-item');
        if (items.length > 10) {
            items[items.length - 1].remove();
        }

        // Animate new item
        activityItem.style.opacity = '0';
        activityItem.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            activityItem.style.transition = 'all 0.5s ease';
            activityItem.style.opacity = '1';
            activityItem.style.transform = 'translateY(0)';
        }, 100);
    }

    setupUserPresence() {
        // Show online users simulation
        const usersList = document.getElementById('online-users');
        if (!usersList) return;

        const users = [
            { name: 'mayor', status: 'coding', color: 'neon-green' },
            { name: 'hackerman', status: 'deploying', color: 'amber' },
            { name: 'caffeine-addict', status: 'debugging', color: 'purple' },
            { name: 'digital-nomad', status: 'traveling', color: 'blue' },
            { name: 'bot-overlord', status: 'monitoring', color: 'red' }
        ];

        const onlineCount = Math.floor(Math.random() * 5) + 3;
        const onlineUsers = users.slice(0, onlineCount);

        usersList.innerHTML = onlineUsers.map(user => `
            <div class="user-item">
                <span class="user-status ${user.color}">●</span>
                <span class="user-name">${user.name}</span>
                <span class="user-activity">(${user.status})</span>
            </div>
        `).join('');

        // Update presence periodically
        setInterval(() => {
            onlineUsers.forEach(user => {
                const activities = ['coding', 'debugging', 'deploying', 'coffee break', 'thinking', 'documenting'];
                user.status = activities[Math.floor(Math.random() * activities.length)];
            });
            
            usersList.innerHTML = onlineUsers.map(user => `
                <div class="user-item">
                    <span class="user-status ${user.color}">●</span>
                    <span class="user-name">${user.name}</span>
                    <span class="user-activity">(${user.status})</span>
                </div>
            `).join('');
        }, 60000); // Update every minute
    }

    setupDiscussionFilters() {
        const filterButtons = document.querySelectorAll('.discussion-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                this.filterDiscussions(filter);
            });
        });
    }

    filterDiscussions(filter) {
        const discussions = document.querySelectorAll('.discussion-item');
        discussions.forEach(discussion => {
            const category = discussion.dataset.category;
            if (filter === 'all' || category === filter) {
                discussion.style.display = 'block';
            } else {
                discussion.style.display = 'none';
            }
        });
    }

    setupNotifications() {
        // Simulate occasional community notifications
        const notificationContainer = document.getElementById('community-notifications');
        if (!notificationContainer) return;

        const notifications = [
            { type: 'info', message: 'New lab log posted: "Kubernetes cluster disaster recovery"', icon: '📝' },
            { type: 'success', message: 'Community member milestone: 100 commits reached!', icon: '🎉' },
            { type: 'warning', message: 'Scheduled maintenance: Docker registry offline for 5 minutes', icon: '⚠️' },
            { type: 'info', message: 'Discussion trending: "Best practices for homelab security"', icon: '🔥' }
        ];

        // Show random notification every 2-5 minutes
        setTimeout(() => {
            this.showNotification(notifications[Math.floor(Math.random() * notifications.length)]);
        }, Math.random() * 180000 + 120000);
    }

    showNotification(notification) {
        const notificationContainer = document.getElementById('community-notifications');
        if (!notificationContainer) return;

        const notificationElement = document.createElement('div');
        notificationElement.className = `notification ${notification.type}`;
        notificationElement.innerHTML = `
            <span class="notification-icon">${notification.icon}</span>
            <span class="notification-message">${notification.message}</span>
            <button class="notification-close">×</button>
        `;

        notificationContainer.appendChild(notificationElement);

        // Add animation
        notificationElement.style.opacity = '0';
        notificationElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notificationElement.style.transition = 'all 0.3s ease';
            notificationElement.style.opacity = '1';
            notificationElement.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notificationElement);
        }, 5000);

        // Close button functionality
        notificationElement.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notificationElement);
        });
    }

    removeNotification(notificationElement) {
        notificationElement.style.opacity = '0';
        notificationElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.remove();
            }
        }, 300);
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
    
    window.Terminal.prototype.processCommand = function(command, prompt) {        const communityCommands = {
            'community': 'Welcome to ByteBox Community! Visit /community.html for discussions',
            'discussions': 'GitHub Discussions: https://github.com/orgs/bytebox-forge/discussions',
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
