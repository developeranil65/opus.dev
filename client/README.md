# Opus Frontend Application

The frontend for Opus is a high-performance single-page application built with React 19 and TypeScript. It is optimized for real-time data visualization and responsiveness.

## Features

* **Real-Time Updates:** Custom WebSocket hooks manage connection lifecycles and listen for live broadcast events triggered by the backend Redis Pub/Sub layer.
* **Optimized Production Build:** Utilizes a multi-stage Docker build process where the final artifact is a static bundle served by Nginx, ensuring high performance and low resource usage.
* **UI/UX:** Implements modern design patterns using Tailwind CSS and Framer Motion for smooth transitions and immediate user feedback.

## Development

To run the frontend in a local development environment:

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure environment variables in `.env`:
    ```env
    VITE_API_URL=http://localhost:3000/api/v1
    VITE_WS_URL=ws://localhost:3000
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

## Production Build

For production deployment, the application is built using Vite and served via Nginx. The Dockerfile in this directory handles the build and configuration steps automatically when orchestrated via Docker Compose.