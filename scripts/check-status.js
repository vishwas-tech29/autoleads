#!/usr/bin/env node

const http = require('http');

function checkServer(port, path = '/') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      resolve({
        status: res.statusCode,
        message: `Server on port ${port} is ${res.statusCode === 200 ? 'running' : 'responding with status ' + res.statusCode}`
      });
    });

    req.on('error', (err) => {
      reject({
        status: 'error',
        message: `Server on port ${port} is not running: ${err.message}`
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject({
        status: 'timeout',
        message: `Server on port ${port} timed out`
      });
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Checking AutoLead AI servers...\n');

  // Check frontend
  try {
    const frontend = await checkServer(3001);
    console.log('✅ Frontend:', frontend.message);
  } catch (error) {
    console.log('❌ Frontend:', error.message);
  }

  // Check backend
  try {
    const backend = await checkServer(3001, '/health');
    console.log('✅ Backend API:', backend.message);
  } catch (error) {
    console.log('❌ Backend API:', error.message);
  }

  console.log('\n🚀 AutoLead AI Status Check Complete!');
  console.log('📱 Frontend: http://localhost:3001');
  console.log('🔧 Backend: http://localhost:3001/api');
}

main().catch(console.error);