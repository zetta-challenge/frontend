# 🎙️ ElevenLabs Frontend

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, responsive frontend application for ElevenLabs text-to-speech services built with SvelteKit. Features voice management, model browsing, and high-quality speech synthesis with real-time streaming capabilities.

## 🚀 Quick Start
> **It is recommended to clone this project inside a common folder alongside the backend and/or infrastructure repos!**

**📋 Prerequisites:** This frontend requires a compatible backend server to function properly.

**📖 Setup Guides:**
- 🔧 [Backend Configuration](docs/backend-setup.md) - Shows the complete backend setup instructions.
- 🧪 [Development Guide](docs/development.md) - Contains detailed development instructions, testing, building, and contribution guidelines.


## ✨ Features

- 🎵 **Voice Management** - Create, delete, and browse custom voices
- 🔍 **Smart Search** - Real-time search for voices and models
- 🎯 **Multiple Models** - Support for various ElevenLabs TTS models
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌙 **Dark Mode** - Built-in light/dark theme toggle
- 📄 **File Upload** - Support for .txt and .pdf text extraction
- 🎛️ **Audio Controls** - Built-in audio player with download functionality
- ⚡ **Real-time Streaming** - Live audio streaming during generation
- 📊 **Character Counter** - Track text length for optimal processing
- 🎨 **Modern UI** - Beautiful, accessible interface with smooth animations

## 🛠️ Technology Stack

- **Framework:** SvelteKit with TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **HTTP Client:** Axios for API communication
- **PDF Processing:** PDF.js for text extraction
- **State Management:** Svelte stores
- **Notifications:** Custom toast system
- **Icons:** Custom SVG icons with base64 encoding

## ⚡ Quick local start

```bash
# NPM
npm install
npm run dev

# PNPM
pnpm i
pnpm dev
```

> **Note:** Make sure to configure your environment variables as described in the [Development Guide](docs/development.md).

## 🎯 Usage

### Voice Management
- **Browse Voices:** View all available voices in a searchable table
- **Create Voice:** Upload audio samples to create custom voices
- **Delete Voice:** Remove voices using their Voice ID
- **Search:** Filter voices by name in real-time

### Text-to-Speech
- **Standard Conversion:** Generate complete audio files
- **Streaming Mode:** Real-time audio generation and playback
- **File Upload:** Extract text from .txt and .pdf files
- **Format Options:** Choose from multiple audio output formats
- **Model Selection:** Select from various ElevenLabs models

### Models Browser
- **Explore Models:** Browse available TTS models
- **Model Details:** View specifications, language support, and capabilities
- **Search Models:** Filter models by name or ID

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_API_URL` | Backend API base URL | `http://localhost:8080` |

### Supported Audio Formats

- MP3 (22kHz, 44.1kHz with various bitrates)
- Multiple quality options from 32kbps to 192kbps

### Supported Models

- `eleven_monolingual_v1`
- `eleven_multilingual_v1`
- `eleven_multilingual_v2`
- `eleven_turbo_v2`
- `eleven_flash_v2`
- `eleven_turbo_v2_5`
- `eleven_flash_v2_5`
- And more...

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DarkMode.svelte # Theme toggle
│   │   ├── Modal.svelte    # Modal dialogs
│   │   └── Nav.svelte      # Navigation bar
│   ├── lib/
│   │   └── api/            # API client and utilities
│   ├── routes/             # SvelteKit routes
│   │   ├── +layout.svelte  # App layout
│   │   ├── +page.svelte    # Voices page
│   │   ├── models/         # Models page
│   │   └── tts/            # Text-to-speech page
│   ├── stores/             # Svelte stores for state management
│   ├── types/              # TypeScript type definitions
│   └── app.css            # Global styles and Tailwind config
├── static/                 # Static assets
└── package.json
```

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS with:

- **Custom Color Palette:** Carefully crafted light and dark theme colors
- **Responsive Breakpoints:** Mobile-first responsive design
- **Animation System:** Smooth transitions and micro-interactions
- **Accessibility:** WCAG compliant color contrasts and keyboard navigation

## 📝 API Endpoints

The frontend communicates with these backend endpoints:

- `GET /api/voices` - Fetch all voices
- `POST /api/voices` - Create new voice
- `DELETE /api/voices` - Delete voice
- `GET /api/models` - Fetch available models
- `POST /api/tts/convert` - Convert text to speech
- `POST /api/tts/stream` - Stream text-to-speech conversion

## Troubleshooting

### Common Issues

**Connection refused errors:**
- Ensure your backend server is running
- Check the `PUBLIC_API_URL` environment variable

**File upload failures:**
- Verify file size limits on your backend
- Ensure supported file types (.txt, .pdf)

**Audio playback issues:**
- Check browser audio permissions
- Verify audio format support

---

<div align="center">
  Made with ❤️ and SvelteKit
</div>