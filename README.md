# The Spintastic Wheel! 🎡

A beautiful, interactive Wheel of Fortune web application built with Lit, TypeScript, and modern web technologies. Perfect for random selection, giveaways, or decision-making games.

## ✨ Features

- **Interactive Wheel**: Smooth spinning animation with realistic physics
- **Customizable Participants**: Add up to 30 names for the wheel segments
- **Rainbow Color Scheme**: Automatically generates vibrant, evenly distributed colors
- **Confetti Celebration**: Festive confetti animation when a winner is selected
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Security Features**: Input sanitization and Content Security Policy
- **Modern UI**: Beautiful gradient backgrounds and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pao-wheel-of-fortune
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🎮 How to Use

1. **Add Participants**: Enter names in the text area (one per line)
2. **Update Wheel**: Click "Update" to refresh the wheel with new names
3. **Spin the Wheel**: Click the "Spin" button to start the animation
4. **Celebrate**: Watch the confetti when a winner is selected!

### Tips
- Minimum 2 names required
- Maximum 30 names allowed
- Names are automatically sanitized for security
- Wheel colors are automatically generated in rainbow order

## 🏗️ Technology Stack

- **Frontend Framework**: Lit (Web Components)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Canvas API + canvas-confetti
- **Fonts**: Google Fonts (Roboto, Bungee)

## 📁 Project Structure

```
pao-wheel-of-fortune/
├── src/
│   ├── components/
│   │   └── wheel-of-fortune.ts    # Main wheel component
│   ├── styles/
│   │   └── index.css              # Tailwind imports
│   └── main.ts                    # Application entry point
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite configuration
└── README.md                      # This file
```

## 🔧 Development

This project uses modern web standards:
- **Web Components**: Custom elements with Lit
- **TypeScript**: Full type safety
- **ES Modules**: Modern JavaScript modules
- **CSS-in-JS**: Scoped styling with Lit's CSS tagged template literals

### Key Components

- **WheelOfFortune**: Main component handling wheel rendering, spinning logic, and user interactions
- **Canvas Rendering**: Custom wheel drawing with smooth animations
- **Input Management**: Secure text input with sanitization
- **Responsive Design**: Automatic canvas resizing and mobile optimization

## 🌐 Deployment

To build for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🔒 Security

- **Content Security Policy**: Configured to prevent XSS attacks
- **Input Sanitization**: Removes potentially dangerous characters
- **Safe Fonts**: Uses system fonts and trusted Google Fonts CDN

## 🎨 Customization

The wheel can be customized by modifying the `WheelOfFortune` component:
- Change colors by modifying the `generateRainbowColors` method
- Adjust animation timing in the `spin` method
- Modify confetti settings in the `celebrateWinner` method

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Lit, TypeScript, and modern web technologies.