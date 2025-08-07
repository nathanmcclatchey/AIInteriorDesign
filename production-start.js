#!/usr/bin/env node

// Production start script for deployment
import { spawn } from 'child_process';

console.log('🚀 Starting AI Interior Design Platform...');

// Set environment variables for production
const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: process.env.PORT || '3000'
};

// Use nodemon with ts-node for reliable TypeScript execution
const server = spawn('npx', ['nodemon', '--exec', 'npx ts-node server/index.ts'], {
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