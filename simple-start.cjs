#!/usr/bin/env node

// Simple deployment start script that works with Replit
const { spawn } = require('child_process');

console.log('🚀 Starting AI Interior Design Platform...');

const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: process.env.PORT || '3000'
};

// Use ts-node with explicit CommonJS configuration
const server = spawn('npx', ['ts-node', '--project', 'tsconfig-node.json', 'server/index.ts'], {
  stdio: 'inherit',
  env
});

server.on('close', (code) => {
  if (code !== 0) {
    console.log(`Server process exited with code ${code}`);
  }
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});