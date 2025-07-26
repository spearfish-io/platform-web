// Simple test to check if middleware is working
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Location: ${res.headers.location || 'No redirect'}`);
  
  if (res.statusCode === 307 || res.statusCode === 302) {
    console.log('✅ Middleware is redirecting to login!');
  } else if (res.statusCode === 200) {
    console.log('❌ Page loaded without redirect - middleware not working');
  } else {
    console.log('⚠️  Unexpected status code');
  }
});

req.on('error', (e) => {
  console.error(`❌ Connection error: ${e.message}`);
  console.log('Make sure the Next.js dev server is running with: npm run dev');
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
});

req.end();