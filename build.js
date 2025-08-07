#!/usr/bin/env node

// Build script for deployment
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

console.log('🏗️  Building AI Interior Design Platform...');

try {
  // Create dist directory if it doesn't exist
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }

  // Build frontend
  console.log('📦 Building frontend...');
  execSync('vite build', { stdio: 'inherit' });

  // Build server
  console.log('⚙️  Building server...');
  execSync('tsc --project tsconfig.server.json', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  console.log('🚀 Ready for deployment with: node dist/server/index.js');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}