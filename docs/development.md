# 👩‍💻 Development Guide

This guide covers everything you need to know for developing, building, and contributing to the ElevenLabs Frontend project.

## 📋 Prerequisites

Before starting development, ensure you have:

- **Node.js** (v22 or higher)
- **npm** or **pnpm** package manager
- **Git** for version control
- A compatible backend server (see [Backend Setup Guide](backend-setup.md))

## 🚀 Installation & Setup

Immediately after pulling the repo and installing dependencies either via npm or pnpm you need to setup the .env file. 

### Environment Configuration
For this purpose you can just copy the example file that will work locally out of the box.
Inside the root of the repo  - `cp .env.example .env` or use the vars below

```env
# Backend API Configuration
PUBLIC_API_URL=http://localhost:8080

# Optional: Additional configuration
# PUBLIC_DEBUG=true
```

### Start Development Server

```bash
npm run dev
pnpm dev
```

The application will be available at `http://localhost:5173` and **please be mindful that the port used with a local webserver might differ from what the backend might expect!** 
Using docker compose will host the FE on `3000` if you use the file provided in the [Backend Setup Guide](backend-setup.md)

## 🏗️ Project Structure

```
frontend/
├── docs/                   # Documentation files
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── DarkMode.svelte # Theme toggle component
│   │   ├── Modal.svelte    # Modal dialog component
│   │   └── Nav.svelte      # Navigation component
│   ├── lib/
│   │   └── api/            # API client and utilities
│   │       ├── client.ts   # Axios-based API client
│   │       └── environment.ts # Environment configuration
│   ├── routes/             # SvelteKit routes/pages
│   │   ├── +layout.svelte  # Main app layout
│   │   ├── +page.svelte    # Home page (voices)
│   │   ├── models/         # Models page
│   │   │   └── +page.svelte
│   │   └── tts/            # Text-to-speech page
│   │       ├── +page.svelte
│   │       └── +server.ts
│   ├── stores/             # Svelte stores for state management
│   │   ├── voices.ts       # Voice management store
│   │   ├── models.ts       # Models data store
│   │   └── tts.ts          # TTS functionality store
│   ├── types/              # TypeScript type definitions
│   │   └── pdfjs-dist.d.ts # PDF.js type definitions
│   ├── app.css            # Global styles and Tailwind config
│   ├── app.d.ts           # App-level type definitions
│   └── app.html           # HTML template
├── static/                 # Static assets
│   ├── ElevenLabs-logo.png
│   ├── tech-logo.png
│   └── pdf.worker.min.mjs  # PDF.js web worker
├── tailwind.config.ts      # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── package.json
```

## 🛠️ Development Commands

### Core Commands

```bash
# Start development server
npm run dev
pnpm dev

# Build the app
npm run build
pnpm build
```

### Useful Development Scripts

```bash
# Watch mode with type checking
npm run check:watch

# Clean build directory
rm -rf .svelte-kit build

# Install new dependency
npm install <package-name>
pnpm add <package-name>
```

### Build Output

The build creates optimized files in the `build/` directory:
- Static assets are optimized and fingerprinted
- JavaScript is bundled and minified
- CSS is extracted and minified
- Images are optimized

## 🌊 Workflow
### Development Workflow

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test your changes:**
   ```bash
   npm run check
   npm run build
   ```
5. **Commit your changes:**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to your branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request to `dev`**

### TODO: Deployment Options -> Add explanation on GitHub Actions

## 📚 API Lore
This frontend application consumes the following API endpoints:
- `GET /api/voices` - Fetch all available voices
- `POST /api/voices` - Create a new voice from audio samples
- `DELETE /api/voices` - Delete a voice by ID
- `GET /api/models` - Fetch all available TTS models
- `POST /api/tts/convert` - Convert text to speech (complete file)
- `POST /api/tts/stream` - Convert text to speech (streaming)

### Expected API Response Formats

**Voices Response:**
```json
[
  {
    "voiceId": "string",
    "name": "string"
  }
]
```

**Models Response:**
```json
[
  {
    "modelId": "string",
    "name": "string",
    "description": "string",
    "canDoTTS": boolean,
    "canDoVoiceConversion": boolean,
    "tokenCostFactor": number,
    "maxCharReqFreeUser": number,
    "maxCharReqSubscribedUser": number,
    "maximumTextLengthPerRequest": number,
    "languages": [
      {
        "name": "string",
        "languageId": "string"
      }
    ]
  }
]
```

## 🎨 Styling & Design System

### Tailwind CSS Configuration

The project uses a custom Tailwind configuration with:

- **Custom Colors:** Defined in `app.css` using CSS custom properties
- **Custom Spacing:** Additional spacing values for design consistency
- **Custom Radius:** Extended border radius options
- **Dark Mode:** Built-in dark mode support using the `dark:` prefix

### Custom CSS Variables

```css
/* Available custom colors */
--color-gwhite: rgb(250 250 255);
--color-alice-blue: rgb(244 250 255);
--color-flash-white: rgb(239, 241, 243);
--color-metalic: rgb(232 235 236);
--color-cadet-gray: rgb(149 163 164);
--color-payne-gray: rgb(79 93 117);
--color-smoke: rgb(60 60 60);
--color-gunmetal: rgb(48 52 63);
--color-eerie-black: rgb(36 36 35);
--color-night: rgb(15 14 14);

/* Alpha variants for overlays */
--color-balpha2: rgba(0, 0, 0, 0.2);
--color-walpha1: rgba(255, 255, 255, 0.1);
```

### Component Styling Guidelines

- Use Tailwind utility classes for styling
- Leverage custom CSS variables for consistent theming
- Implement responsive design with mobile-first approach
- Use `dark:` prefix for dark mode variants
- Apply smooth transitions for interactive elements

## 🔧 API Integration

### API Client Structure

The project uses Axios for HTTP requests with a centralized client:

```typescript
// Example API call
import { apiClient } from '../lib/api/client'

const fetchVoices = async (): Promise<Voice[]> => {
  const response = await apiClient<Voice[]>('/api/voices')
  return response.data
}
```

### Environment Configuration

API endpoints are configured via environment variables:

```typescript
// Access environment variables
import { env } from '$env/dynamic/public'
const apiUrl = env.PUBLIC_API_URL
```

### Error Handling

Implement consistent error handling:

```typescript
try {
  const data = await apiCall()
  // Handle success
} catch (error) {
  if (error instanceof Error) {
    toast.error(`Operation failed: ${error.message}`)
  } else {
    toast.error('An unknown error occurred')
  }
}
```

## 📦 State Management

### Svelte Stores

The application uses Svelte stores for state management:

```typescript
// Example store definition
export const voices = writable<Voice[]>([])
export const isLoading = writable<boolean>(false)
export const error = writable<string | null>(null)

// Store methods
export const fetchVoices = async (): Promise<void> => {
  isLoading.set(true)
  try {
    const data = await apiClient<Voice[]>('/api/voices')
    voices.set(data)
    error.set(null)
  } catch (err) {
    error.set(err.message)
  } finally {
    isLoading.set(false)
  }
}
```

### Store Usage in Components

```svelte
<script lang="ts">
  import { voices, isLoading, fetchVoices } from '../stores/voices'
  import { onMount } from 'svelte'

  onMount(() => {
    fetchVoices()
  })
</script>

{#if $isLoading}
  <p>Loading...</p>
{:else if $voices.length > 0}
  {#each $voices as voice}
    <div>{voice.name}</div>
  {/each}
{/if}
```

## 🧪 Testing

### Setting Up Tests

```bash
# Install testing dependencies
npm install -D @testing-library/svelte @testing-library/jest-dom vitest jsdom

# Add to package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

### Writing Component Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'
import Component from './Component.svelte'

test('should render component', () => {
  render(Component, { props: { title: 'Test' } })
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

### API Testing

Mock API calls for testing:

```typescript
import { vi } from 'vitest'
import * as apiClient from '../lib/api/client'

vi.mock('../lib/api/client', () => ({
  apiClient: vi.fn()
}))

test('should fetch voices', async () => {
  const mockVoices = [{ id: '1', name: 'Test Voice' }]
  vi.mocked(apiClient.apiClient).mockResolvedValue({ data: mockVoices })
  
  // Test your component/store
})
```

## 🚀 Building & Deployment

### Production Build

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### Code Style Guidelines

**TypeScript:**
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

**Svelte:**
- Use composition over inheritance
- Keep components small and focused
- Use TypeScript for props and events
- Follow reactive statement best practices

**CSS/Styling:**
- Use Tailwind utility classes
- Avoid custom CSS unless necessary
- Maintain consistent spacing using design tokens
- Ensure proper contrast ratios for accessibility

**File Organization:**
- Group related components in directories
- Use descriptive file names
- Keep store files focused on single concerns
- Organize types by feature area

### Commit Message Convention

Use conventional commits for clear history:

```
feat: add new voice creation feature
fix: resolve audio playback issue
docs: update API documentation
style: improve button hover effects
refactor: simplify voice store logic
test: add voice management tests
```

### Pull Request Guidelines

**Before submitting:**
- ✅ Code builds without errors
- ✅ All tests pass
- ✅ TypeScript types are correct
- ✅ Code follows style guidelines
- ✅ Documentation is updated if needed

**PR Description should include:**
- Clear description of changes
- Screenshots for UI changes
- Breaking changes (if any)
- Testing instructions

## 🐛 Troubleshooting

### Common Development Issues

**"Module not found" errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Run type checking
npm run check

# Clear SvelteKit cache
rm -rf .svelte-kit
```

**Build failures:**
```bash
# Check for environment variables
echo $PUBLIC_API_URL

# Verify all dependencies are installed
npm list --depth=0
```

**Hot reload not working:**
```bash
# Restart development server
npm run dev

# Check for file watching limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
```

### Performance Optimization

**Bundle analysis:**
```bash
npm run build -- --analyze
```

**Lighthouse testing:**
- Use Chrome DevTools Lighthouse
- Test both mobile and desktop
- Focus on Core Web Vitals

**Code splitting:**
```typescript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent.svelte'))
```

## 📚 Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)

---

For additional help or questions, please open an issue in the repository or refer to the project documentation.