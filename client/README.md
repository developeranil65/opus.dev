# Opus Frontend Application

A high-performance Single Page Application (SPA) built with React 19, TypeScript, and Tailwind CSS. It is optimized for real-time data visualization, handling rapid-fire WebSocket updates without freezing the main thread.

## ⚡ Performance Optimizations

### 1. Render Throttling (Sampling)

When 10,000 users vote, the backend broadcasts hundreds of updates per second. Updating React state on every message causes "Render Thrashing" and freezes the UI.

**Solution:** I implemented a custom hook `usePollWebSocket` that utilizes a Ref-based Buffer:

- Incoming WebSocket messages update a `useRef` variable (No re-render).
- A `setInterval` runs every 1000ms to copy the Ref data to React State.
- **Result:** The UI updates smoothly at 1 FPS regardless of network traffic (1000 msg/sec).

### 2. Optimistic UI Updates

For the voting action, we don't wait for the WebSocket broadcast to update the user's screen. We immediately show the "Voted" state to ensure the app feels instant, while the backend processes the request asynchronously.

### 3. Production Build Strategy

I used a Multi-Stage Docker Build to serve the application:

- **Build Stage:** Node.js container compiles TypeScript/React to static HTML/JS/CSS (Vite).
- **Serve Stage:** A lightweight Nginx container serves the static files.
- **Benefit:** The final image size is ~20MB, and Nginx handles Gzip compression and caching headers automatically.

## UI/UX Features

- **Glassmorphism & Motion:** Uses framer-motion for smooth layout transitions and MovingCards for dynamic testimonials.
- **Adaptive Design:** Fully responsive layouts for mobile and desktop using Tailwind's utility classes.
- **Dynamic Charts:** Custom-built progress bars that animate smoothly as new votes arrive.

## Development Setup

The development environment is configured to proxy API requests to the backend, avoiding CORS issues without Nginx.

### Configuration (vite.config.ts)

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true
  },
  '/ws': {
    target: 'ws://localhost:3000',
    ws: true
  }
}
```

### Commands

```bash
# Install dependencies
npm install

# Run dev server (accessible at http://localhost:5173)
npm run dev

# Build for production
npm run build
```