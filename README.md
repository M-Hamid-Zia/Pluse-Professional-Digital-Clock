# Pulse — Professional Digital Clock

A sleek, modern digital clock web application with advanced features including timezone support, customizable alarms, and beautiful visual design.


## ✨ Features

### 🕒 Core Functionality
- **Real-time Clock**: Accurate time display with smooth or discrete animations
- **Multiple Time Formats**: Toggle between 12-hour and 24-hour formats
- **Timezone Support**: Choose from 12+ global timezones
- **Date Display**: Full date with weekday, month, and year

### 🎨 Customization
- **Dark/Light Themes**: Toggle between dark and light modes
- **Accent Colors**: 8 beautiful color themes (Teal, Coral, Purple, Magenta, Lawngreen, Indigo, Maroon, Olive)
- **Smooth Animations**: Optional smooth second transitions or discrete updates
- **Glassmorphism Design**: Modern frosted glass UI elements

### ⏰ Alarm System
- **Set Custom Alarms**: Set alarms with optional labels
- **Browser Notifications**: Desktop notifications when alarm triggers
- **Snooze Function**: 5-minute snooze capability
- **Audio Alerts**: Built-in alarm sound using Web Audio API
- **Alarm Management**: Easy setup and cancellation

### ⌨️ User Experience
- **Keyboard Shortcuts**: 
  - `F` - Toggle time format
  - `T` - Toggle theme
  - `A` - Open alarm modal
  - `S` - Toggle smooth animation
  - `ESC` - Close modals
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Performance Optimized**: Stops clock updates when tab is inactive
- **Local Storage**: Saves all settings and alarms between sessions

## 🚀 Quick Start

### Installation
1. Download all project files:
   - `index.html`
   - `style.css` 
   - `script.js`
   - `clock.png` (favicon)

2. Open `index.html` in a web browser

### Usage
- **Toggle Time Format**: Click the "12H/24H" button or press `F`
- **Change Timezone**: Use the dropdown to select your preferred timezone
- **Switch Themes**: Click the theme toggle button or press `T`
- **Set Alarm**: Click "Set Alarm" button or press `A`
- **Customize Colors**: Click the accent color indicator to cycle through colors

## 🛠️ Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern features like CSS Grid, Flexbox, and CSS Variables
- **JavaScript ES6+**: Classes, modules, and modern APIs
- **Web APIs**: 
  - Web Audio API for alarm sounds
  - Notification API for browser alerts
  - Intl API for timezone formatting

### File Structure
```
pulse-clock/
│
├── index.html          # Main HTML structure
├── style.css           # All styles and themes
├── script.js           # Clock functionality and logic
└── clock.png           # Favicon
```

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F` | Toggle 12H/24H format |
| `T` | Toggle dark/light theme |
| `A` | Open alarm setting modal |
| `S` | Toggle smooth/discrete animation |
| `ESC` | Close open modals |

## ⚙️ Configuration

### Timezone Support
The clock supports the following timezones:
- Local Time
- UTC
- New York (EST)
- Los Angeles (PST) 
- London (GMT)
- Paris (CET)
- Karachi (PKT)
- Tokyo (JST)
- Shanghai (CST)
- Sydney (AEDT)
- Dubai (GST)
- Toronto (EST)

### Accent Colors
- Teal (default)
- Coral
- Purple  
- Magenta
- Lawngreen
- Indigo
- Maroon
- Olive

## 🔧 Browser Permissions

For full functionality, allow:
- **Notifications**: For browser alarm notifications
- **Audio**: For alarm sounds

## 📱 Mobile Support

Fully responsive design with:
- Touch-optimized controls (44px minimum touch targets)
- Mobile-optimized layouts
- Reduced motion support for accessibility

## 🌐 Accessibility

- High contrast mode support
- Reduced motion preferences respected
- Keyboard navigation
- Semantic HTML structure
- ARIA labels and roles

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions, please open an issue in the project repository.

---

**Built with precision • Code With Admin**
