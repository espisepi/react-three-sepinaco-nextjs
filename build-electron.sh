#!/bin/bash

# Clean build directory
rm -rf dist out

# Build Next.js
echo "Building Next.js..."
npm run build:next

# Create a temporary directory for electron build
mkdir -p temp-electron-build

# Copy necessary files
cp -r main temp-electron-build/
cp -r out temp-electron-build/
cp package.json temp-electron-build/

# Copy only necessary node_modules (excluding problematic SWC packages)
echo "Copying node_modules..."
mkdir -p temp-electron-build/node_modules

# Copy all node_modules except SWC packages
rsync -av --exclude='@next/swc-*' --exclude='@swc/core-*' node_modules/ temp-electron-build/node_modules/

# Copy only the ARM64 SWC packages
if [ -d "node_modules/@next/swc-darwin-arm64" ]; then
  cp -r node_modules/@next/swc-darwin-arm64 temp-electron-build/node_modules/@next/
fi

if [ -d "node_modules/@swc/core-darwin-arm64" ]; then
  cp -r node_modules/@swc/core-darwin-arm64 temp-electron-build/node_modules/@swc/core-darwin-arm64
fi

# Build electron app
echo "Building Electron app..."
cd temp-electron-build
npx electron-builder --config ../electron-builder.yaml
cd ..

# Clean up
rm -rf temp-electron-build

echo "Build complete! Check the dist/ directory."

