# Byte Box - Cyberpunk Tech Blog

A Jekyll-powered static site with a handcrafted cyberpunk aesthetic inspired by classic hacker movies like *The Matrix*, *Hackers*, and *Johnny Mnemonic*. Built for GitHub Pages to showcase homelab experiments, Docker projects, and digital adventures.

## 🎨 Features

- **Terminal-style interface** with animated boot sequences
- **Cyberpunk color palette** (neon green, amber, purple, deep black)
- **Matrix-style background effects** and glitch animations
- **Mobile-responsive design** that works on all devices
- **Jekyll-powered** with Markdown blog support
- **SEO optimized** with proper meta tags and structured data
- **Fast loading** with optimized CSS and JavaScript

## 🛠️ Technology Stack

- **Jekyll 4.3+** - Static site generator
- **SCSS** - Custom cyberpunk styling
- **Vanilla JavaScript** - Terminal effects and animations
- **GitHub Pages** - Hosting platform
- **JetBrains Mono** - Monospace font for that terminal feel

## 🚀 Quick Start

### Prerequisites

- Ruby 2.7+
- Bundler
- Jekyll 4.3+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[username]/byte-box.git
   cd byte-box
   ```

2. **Install dependencies**
   ```bash
   bundle install
   ```

3. **Serve locally**
   ```bash
   bundle exec jekyll serve
   ```

4. **Open in browser**
   ```
   http://localhost:4000
   ```

### Configuration

Edit `_config.yml` to customize:

```yaml
title: "Your Site Title"
description: "Your cyberpunk description"
author:
  name: "Your Handle"
  email: "your@email.com"
  matrix: "@you:matrix.org"
```

## 📁 Site Structure

```
/
├── index.html              # Animated terminal homepage
├── about.html              # whoami-style bio page
├── contact.html            # Secure communication channels
├── 404.html                # System breach error page
├── _layouts/
│   ├── default.html        # Main layout with cyberpunk styling
│   └── post.html           # Blog post layout
├── _sass/
│   ├── _base.scss          # Base styles and variables
│   ├── _cyberpunk.scss     # Terminal and UI components
│   ├── _layout.scss        # Page layouts and responsive design
│   ├── _animations.scss    # Glitch effects and animations
│   └── _components.scss    # Specialized components
├── assets/
│   ├── css/main.scss       # SCSS entry point
│   └── js/
│       ├── terminal.js     # Terminal effects and interactions
│       ├── glitch.js       # Cyberpunk glitch effects
│       └── matrix.js       # Matrix background animation
├── lab-logs/               # Blog posts about homelab/tech
├── modules/                # Project showcases
├── payloads/               # Tools and scripts
├── blackbox/               # Unfiltered thoughts
└── _config.yml             # Jekyll configuration
```

## ✍️ Content Creation

### Blog Posts (Lab Logs)

Create new posts in `_lab-logs/` with frontmatter:

```yaml
---
layout: post
title: "Your Post Title"
date: 2024-12-28 15:30:00 -0000
categories: lab-logs
tags: [docker, homelab, cyberpunk]
description: "Brief description for SEO"
github_repo: "https://github.com/username/repo"
---

Your cyberpunk content here...
```

### Project Modules

Add projects to `_modules/` collection:

```yaml
---
layout: post
title: "Project Name"
description: "What it does"
github_repo: "https://github.com/username/project"
demo_url: "https://demo.example.com"
tags: [docker, automation, security]
---

Project documentation and screenshots...
```

### Tools & Scripts (Payloads)

Add tools to `_payloads/` collection:

```yaml
---
layout: post
title: "Script Name"
description: "Tool description"
file_extension: "py"
download_url: "/assets/downloads/script.py"
tags: [python, automation, security]
---

Usage instructions and code examples...
```

### Random Thoughts (Black Box)

Add rants to `_blackbox/` collection:

```yaml
---
layout: post
title: "Thought Title"
mood: angry  # angry, confused, excited, frustrated
tags: [rant, technology, existential-dread]
---

Unfiltered stream of consciousness...
```

## 🎨 Customization

### Color Scheme

Modify the cyberpunk palette in `_sass/_base.scss`:

```scss
:root {
    --neon-green: #00ff41;    // Matrix green
    --amber: #ffb000;         // Warning amber
    --purple: #8a2be2;        // Cyber purple
    --red: #ff0040;           // Error red
    --bg-black: #000000;      // Deep black
}
```

### Typography

Change the monospace font in `_layouts/default.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```

### Terminal Effects

Customize animations in `assets/js/terminal.js`:

- Boot sequence timing
- Typing effect speed
- Command processing
- Matrix background intensity

### ASCII Art

Replace the ASCII logo in `index.html`:

```html
<pre class="ascii-art" id="ascii-art">
Your custom ASCII art here...
</pre>
```

## 🔧 Development

### Local Development

```bash
# Install dependencies
bundle install

# Serve with live reload
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build
```

### Adding New Features

1. **New page**: Create HTML file with Jekyll frontmatter
2. **New collection**: Add to `_config.yml` and create `_collection/` folder
3. **New styles**: Add SCSS files to `_sass/` and import in `main.scss`
4. **New animations**: Add to `_sass/_animations.scss`

### Performance Optimization

- **Images**: Optimize images before adding to `assets/img/`
- **CSS**: Critical CSS is inlined, non-critical is loaded async
- **JavaScript**: Scripts are loaded after DOM content
- **Fonts**: Web fonts are preloaded for performance

## 🚀 Deployment

### GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Select source**: Deploy from `main` branch
3. **Custom domain** (optional): Add CNAME file

### Manual Deployment

```bash
# Build the site
bundle exec jekyll build

# Deploy _site/ folder to your web server
rsync -avz _site/ user@server:/var/www/html/
```

### CI/CD with GitHub Actions

The repository includes a workflow for automatic deployment to GitHub Pages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Dark/light theme toggle
- [ ] Search functionality across all content
- [ ] RSS feed for all collections
- [ ] Command-line interface easter eggs
- [ ] Progressive Web App features
- [ ] Integration with telnet server
- [ ] Matrix chat widget
- [ ] Real-time server status dashboard

## 🐛 Known Issues

- CRT scanline effect may cause performance issues on older devices
- Matrix background disabled on mobile for battery life
- Some animations reduced for users with motion sensitivity preferences

## 📞 Support

- **Documentation**: Check the [Jekyll docs](https://jekyllrb.com/docs/)
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions
- **Security**: Report security issues privately via email

---

*"Welcome to the real world."* - Morpheus

Built with ❤️ and excessive amounts of ☕ by digital rebels who refuse to accept boring websites as reality.
