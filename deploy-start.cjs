#!/usr/bin/env node

// Simple CommonJS deployment start script
const { spawn } = require('child_process');

console.log('🚀 Starting AI Interior Design Platform for deployment...');

// Set environment variables for production
const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: process.env.PORT || '3000'
};

// Use the working development command but in production mode
const server = spawn('npm', ['run', 'server'], {
  stdio: 'inherit',
  env
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});