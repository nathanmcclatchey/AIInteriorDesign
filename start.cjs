const { spawn } = require('child_process');

console.log('Starting AI Interior Design Platform...');

// Start the backend server
const server = spawn('node', ['server.cjs'], {
  stdio: 'inherit',
  cwd: process.cwd()
});

// Start the frontend dev server
const client = spawn('npx', ['vite'], {
  stdio: 'inherit', 
  cwd: process.cwd()
});

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.kill();
  client.kill();
  process.exit(0);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  client.kill();
  process.exit(code);
});

client.on('exit', (code) => {
  console.log(`Client exited with code ${code}`);
  server.kill();  
  process.exit(code);
});