# Electron Integration

This project has been successfully integrated with Electron.js to create a desktop application.

## Development

To run the application in development mode (Next.js + Electron):

```bash
npm run dev
```

This will start both Next.js development server and Electron simultaneously.

To run only Next.js (for web development):

```bash
npm run dev:next
```

## Building

To build the desktop application:

```bash
npm run build
```

This will:
1. Build the Next.js static files
2. Create a temporary build directory
3. Copy only necessary files (excluding problematic SWC dependencies)
4. Package the Electron application
5. Create distributables in the `dist/` folder

**Note:** The build process uses a custom script (`build-electron.sh`) to avoid issues with SWC dependencies on Apple Silicon Macs.

## Project Structure

- `main/main.js` - Electron main process
- `main/preload.js` - Preload script for secure IPC communication
- `electron-builder.yaml` - Electron builder configuration
- `types/electron.d.ts` - TypeScript definitions for Electron API

## Features

- ✅ Static export from Next.js
- ✅ Hot reload in development
- ✅ Secure IPC communication
- ✅ Cross-platform builds (Windows, macOS, Linux)
- ✅ TypeScript support

## Usage in React Components

You can access Electron APIs in your React components:

```typescript
// Listen to messages from main process
useEffect(() => {
  if (window.electronAPI) {
    window.electronAPI.on('message', (data) => {
      console.log('Received:', data);
    });
  }
}, []);

// Send messages to main process
const sendMessage = () => {
  if (window.electronAPI) {
    window.electronAPI.send('message', { type: 'hello' });
  }
};
```

## Troubleshooting

### Build Issues on Apple Silicon Macs

If you encounter errors like `ENOENT: no such file or directory, scandir '@next/swc-darwin-x64'`, this is due to architecture-specific SWC dependencies. The custom build script (`build-electron.sh`) resolves this by:

1. Excluding problematic x64 SWC packages
2. Only including ARM64-compatible dependencies
3. Using a clean build environment

### Alternative Build Methods

If the custom script doesn't work, you can try:

```bash
# Build only Next.js
npm run build:next

# Then manually run electron-builder
npx electron-builder --config electron-builder.yaml
```

## Notes

- The app uses static export, so Next.js API routes won't work
- For backend functionality, use Electron's main process
- Images are unoptimized for static export compatibility
- The app automatically reloads if Next.js fails to load during development
