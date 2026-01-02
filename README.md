# ♟️ Chess - Play Against AI & Analyze Games

A modern, feature-rich chess application built with React, TypeScript, and Stockfish engine. Play against AI opponents of varying difficulty, analyze positions, and track your game history.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)
![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🤖 **Play Against AI** - Challenge intelligent bots from Beginner to Master level
- 📊 **Position Analysis** - Powered by Stockfish chess engine with deep evaluation
- 📜 **Game History** - Track and review all your games
- ⏱️ **Time Controls** - Various time formats with increment support
- 🎨 **Customizable Board** - 28+ piece themes and 6+ color schemes
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🌐 **PWA Ready** - Installable as a Progressive Web App
- 📤 **PGN Import/Export** - Load and save games in standard format
- ⚡ **Fast & Modern** - Built with Vite for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chess.git
cd chess

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
# Build the app
pnpm build

# Preview the build
pnpm preview
```

## 📁 Project Structure

```
chess/
├── public/              # Static assets
│   ├── chess.svg       # App icon
│   ├── stockfish.js    # Stockfish engine
│   ├── stockfish.wasm  # Stockfish WebAssembly
│   ├── manifest.json   # PWA manifest
│   ├── robots.txt      # SEO robots file
│   └── sitemap.xml     # SEO sitemap
├── src/
│   ├── components/     # React components
│   │   ├── analysis/   # Analysis page components
│   │   ├── common/     # Shared components (Header, Footer, etc.)
│   │   ├── game/       # Game play components
│   │   ├── history/    # History page components
│   │   └── ui/         # UI components (Button, Modal, etc.)
│   ├── config/         # Configuration files
│   │   ├── app.config.ts    # App settings
│   │   ├── seo.config.ts    # SEO configuration
│   │   ├── meta.config.ts   # Social media meta
│   │   └── index.ts         # Config exports
│   ├── constants/      # App constants
│   ├── lib/           # Core libraries
│   │   ├── chess-ai.ts        # AI move generation
│   │   ├── stockfish-engine.ts # Stockfish wrapper
│   │   └── game-service.ts    # Game logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   │   ├── analytics.ts  # Analytics helpers
│   │   └── meta.ts       # Meta tag helpers
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── index.html         # HTML template
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
├── vite.config.ts     # Vite config
└── README.md         # This file
```

## 🎮 Usage

### Playing Against AI

1. Navigate to the **Play** page
2. Choose your color (White/Black)
3. Select bot difficulty (800-2600 rating)
4. Set time control
5. Click "Start Game"

### Analyzing Positions

1. Navigate to the **Analysis** page
2. Set up a position or import PGN
3. Click "Analyze Position"
4. View evaluation, best moves, and depth analysis

### Reviewing History

1. Navigate to the **History** page
2. Browse your past games
3. Click "Analyze" to review any game
4. Export games as PGN

### Customizing Board

1. Click the settings icon ⚙️ in the navigation
2. Choose piece style (28+ options)
3. Select board colors or use presets
4. Adjust animation speed
5. Toggle coordinates display

## ⚙️ Configuration

### Before Deployment

Update configuration files in `src/config/`:

#### 1. `app.config.ts`

```typescript
export const APP_CONFIG = {
	name: 'Chess',
	url: 'https://yourchessapp.com', // Your domain
	social: {
		twitter: '@yourusername',
		github: 'https://github.com/yourusername/chess',
	},
	contact: {
		email: 'support@yourdomain.com',
	},
	analytics: {
		enabled: true,
		googleAnalyticsId: 'G-XXXXXXXXXX', // Your GA4 ID
	},
	verification: {
		google: 'YOUR_GOOGLE_VERIFICATION_CODE',
		bing: 'YOUR_BING_VERIFICATION_CODE',
	},
};
```

#### 2. Update `index.html`

- Replace `https://yourchessapp.com/` with your domain
- Add verification meta tags (uncomment and fill in)
- Update social media images

#### 3. Update `manifest.json`, `robots.txt`, `sitemap.xml`

Replace placeholder URLs with your actual domain.

### Analytics Setup

The app supports Google Analytics 4:

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
3. Add to `src/config/app.config.ts`
4. Set `enabled: true`

**Events Tracked:**

- Page views (automatic)
- Game starts and ends
- Position analysis
- Settings changes
- User engagement time
- Errors and performance

### SEO & Verification

**Google Search Console:**

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property
3. Get verification code
4. Add to `app.config.ts` → `verification.google`
5. Uncomment the meta tag in `index.html`

**Bing Webmaster:**

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Similar process as Google

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Chess Logic**: chess.js
- **Chess UI**: react-chessboard
- **Chess Engine**: Stockfish (WebAssembly)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Storage**: localStorage
- **Analytics**: Google Analytics 4

## 📊 Performance

- ⚡ **Lighthouse Score**: 95+
- 🎨 **First Contentful Paint**: < 1.5s
- ⚙️ **Time to Interactive**: < 3s
- 📦 **Bundle Size**: ~500KB (gzipped)

## 🔒 Security

- XSS Protection enabled
- CORS properly configured
- Content Security Policy ready
- No sensitive data in localStorage
- Safe HTML rendering

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## 📱 PWA Features

- Install as standalone app
- Offline-ready structure
- App shortcuts (Play, Analyze, History)
- Native-like experience
- Push notifications ready

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Type check
pnpm type-check

# Build test
pnpm build
```

## 📈 SEO Optimizations

- ✅ Semantic HTML
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Schema.org structured data
- ✅ Sitemap and robots.txt
- ✅ Mobile-friendly
- ✅ Fast loading
- ✅ Accessibility (ARIA labels)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - [@yourusername](https://twitter.com/yourusername)

## 🙏 Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic library
- [react-chessboard](https://github.com/Clariity/react-chessboard) - Chessboard UI component
- [Stockfish](https://stockfishchess.org/) - Powerful chess engine
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📧 Contact

- Email: support@yourchessapp.com
- Twitter: [@yourusername](https://twitter.com/yourusername)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🗺️ Roadmap

- [ ] Multiplayer support (online play)
- [ ] Chess puzzles
- [ ] Opening book/trainer
- [ ] Endgame tablebase
- [ ] Tournament mode
- [ ] Advanced statistics
- [ ] Mobile apps (iOS/Android)
- [ ] Video tutorials
- [ ] Community features

## 📸 Screenshots

### Game Play

![Game Play](docs/screenshots/play.png)

### Position Analysis

![Analysis](docs/screenshots/analysis.png)

### Game History

![History](docs/screenshots/history.png)

### Board Customization

![Settings](docs/screenshots/settings.png)

---

**Made with ♟️ and ❤️**

**Star ⭐ this repo if you find it helpful!**
