#!/usr/bin/env node

/**
 * Authentication Mode Switcher
 * 
 * Quick script to toggle between mock and real authentication modes.
 * 
 * Usage:
 *   npm run auth:mock    - Switch to mock authentication
 *   npm run auth:real    - Switch to real platform-api
 *   npm run auth:status  - Show current authentication mode
 */

const fs = require('fs')
const path = require('path')

const ENV_FILE = path.join(__dirname, '../.env.local')
const MOCK_AUTH_LINE = 'NEXT_PUBLIC_USE_MOCK_AUTH=true'
const MOCK_AUTH_COMMENT = '# NEXT_PUBLIC_USE_MOCK_AUTH=true'

function readEnvFile() {
  try {
    return fs.readFileSync(ENV_FILE, 'utf8')
  } catch (error) {
    console.error('❌ Could not read .env.local file:', error.message)
    process.exit(1)
  }
}

function writeEnvFile(content) {
  try {
    fs.writeFileSync(ENV_FILE, content, 'utf8')
  } catch (error) {
    console.error('❌ Could not write .env.local file:', error.message)
    process.exit(1)
  }
}

function getCurrentMode() {
  const content = readEnvFile()
  // Check for active (uncommented) mock auth line
  const lines = content.split('\n')
  const hasMockAuth = lines.some(line => 
    line.trim() === MOCK_AUTH_LINE
  )
  return hasMockAuth ? 'mock' : 'real-api'
}

function setMockMode() {
  let content = readEnvFile()
  
  // Check if already in mock mode
  const lines = content.split('\n')
  const hasMockAuth = lines.some(line => line.trim() === MOCK_AUTH_LINE)
  
  if (hasMockAuth) {
    console.log('✅ Already using mock authentication')
    return
  }
  
  // Replace commented line or add new line
  if (content.includes(MOCK_AUTH_COMMENT)) {
    content = content.replace(MOCK_AUTH_COMMENT, MOCK_AUTH_LINE)
  } else {
    // Add at the end of the Authentication Mode section
    const authSectionIndex = lines.findIndex(line => 
      line.includes('Authentication Mode')
    )
    
    if (authSectionIndex !== -1) {
      lines.splice(authSectionIndex + 1, 0, MOCK_AUTH_LINE)
      content = lines.join('\n')
    } else {
      content += `\n${MOCK_AUTH_LINE}\n`
    }
  }
  
  writeEnvFile(content)
  console.log('✅ Switched to mock authentication')
  console.log('📝 Test credentials:')
  console.log('   admin@spearfish.io / password123')
  console.log('   user@spearfish.io / user123456')
  console.log('   test@example.com / test12345')
  console.log('🔄 Restart your dev server to apply changes')
}

function setRealMode() {
  let content = readEnvFile()
  
  if (!content.includes(MOCK_AUTH_LINE)) {
    console.log('✅ Already using real platform-api')
    return
  }
  
  // Comment out the mock auth line
  content = content.replace(MOCK_AUTH_LINE, MOCK_AUTH_COMMENT)
  
  writeEnvFile(content)
  console.log('✅ Switched to real platform-api authentication')
  console.log('🔗 Make sure your platform-api is running on the configured URL')
  console.log('🔄 Restart your dev server to apply changes')
}

function showStatus() {
  const mode = getCurrentMode()
  const content = readEnvFile()
  const apiUrl = content.match(/NEXT_PUBLIC_API_URL=(.+)/)?.[1] || 'not set'
  
  console.log('🔧 Current Authentication Configuration:')
  console.log(`   Mode: ${mode}`)
  console.log(`   API URL: ${apiUrl}`)
  
  if (mode === 'mock') {
    console.log('   📝 Test credentials available for mock mode')
  } else {
    console.log('   🔗 Using real platform-api')
    console.log('   💡 Run "npm run auth:mock" to switch to mock mode')
  }
}

// Parse command line arguments
const command = process.argv[2]

switch (command) {
  case 'mock':
    setMockMode()
    break
  case 'real':
    setRealMode()
    break
  case 'status':
    showStatus()
    break
  default:
    console.log('Usage:')
    console.log('  npm run auth:mock    - Switch to mock authentication')
    console.log('  npm run auth:real    - Switch to real platform-api')
    console.log('  npm run auth:status  - Show current authentication mode')
    process.exit(1)
}