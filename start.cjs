const { spawn } = require('child_process');

console.log('Starting AI Interior Design Platform...');

// Start the backend server
const server = spawn('node', ['server.cjs'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

// Start the frontend dev server  
const client = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  stdio: 'pipe',
  cwd: process.cwd()
});

server.stdout.on('data', (data) => {
  console.log(`[Backend] ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data}`);
});

client.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data}`);
});

client.stderr.on('data', (data) => {
  console.error(`[Frontend Error] ${data}`);
});

// Test servers after startup
setTimeout(() => {
  console.log('Testing server connectivity...');
  require('http').get('http://localhost:3000/api/projects', (res) => {
    console.log('✅ Backend API is responding');
  }).on('error', (err) => {
    console.log('❌ Backend not accessible:', err.message);
  });
  
  require('http').get('http://localhost:5173', (res) => {
    console.log('✅ Frontend is accessible');
    console.log('\n🎉 Application ready at http://localhost:5173');
  }).on('error', (err) => {
    console.log('❌ Frontend not accessible:', err.message);
  });
}, 8000);

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