const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting AI Interior Design Platform...');

// Kill any existing processes on these ports
const killProcesses = () => {
  try {
    require('child_process').execSync('pkill -f "server.cjs" 2>/dev/null || true');
    require('child_process').execSync('pkill -f "vite" 2>/dev/null || true');
  } catch (e) {
    // Ignore errors
  }
};

killProcesses();

// Wait a moment
setTimeout(() => {
  console.log('Starting backend server...');
  const server = spawn('node', ['server.cjs'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  setTimeout(() => {
    console.log('Starting frontend server...');
    const client = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    // Test connectivity after startup
    setTimeout(() => {
      console.log('\n✅ Testing servers...');
      
      // Test backend
      const backendReq = http.request('http://localhost:3000/api/projects', (res) => {
        console.log('✅ Backend API responding on port 3000');
      });
      backendReq.on('error', () => console.log('❌ Backend not responding'));
      backendReq.end();

      // Test frontend
      const frontendReq = http.request('http://localhost:5173', (res) => {
        console.log('✅ Frontend responding on port 5173');
        console.log('\n🎉 Application is ready! Open http://localhost:5173');
      });
      frontendReq.on('error', () => console.log('❌ Frontend not responding'));
      frontendReq.end();
      
    }, 5000);

    client.on('exit', (code) => {
      console.log(`Frontend exited with code ${code}`);
      server.kill();
    });

  }, 2000);

  server.on('exit', (code) => {
    console.log(`Backend exited with code ${code}`);
  });

}, 1000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  killProcesses();
  process.exit(0);
});