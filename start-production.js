#!/usr/bin/env node

// Simple production start script
console.log('🚀 Starting AI Interior Design Platform (Production)...');

// Set production environment
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

// Import and start the built server
try {
  await import('./dist/server/index.js');
} catch (error) {
  console.error('❌ Failed to start production server:', error);
  console.error('Make sure to run the build script first: node build.js');
  process.exit(1);
}