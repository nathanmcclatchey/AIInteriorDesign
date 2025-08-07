#!/usr/bin/env node

// Production start script for deployment
import { existsSync } from 'fs';

console.log('🚀 Starting AI Interior Design Platform...');

// Check if built files exist
if (!existsSync('dist/server/index.js')) {
  console.error('❌ Server build not found. Please run the build script first.');
  process.exit(1);
}

if (!existsSync('dist/index.html')) {
  console.error('❌ Frontend build not found. Please run the build script first.');
  process.exit(1);
}

// Import and start the server
import('./dist/server/index.js').catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});