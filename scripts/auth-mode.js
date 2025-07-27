#!/usr/bin/env node

/**
 * Authentication Mode Switcher
 * 
 * Quick script to toggle between authentication modes.
 * 
 * Usage:
 *   npm run auth:mock    - Switch to mock authentication (MSW)
 *   npm run auth:oauth   - Switch to OAuth platform-api
 *   npm run auth:legacy  - Switch to legacy cookie-based auth
 *   npm run auth:status  - Show current authentication mode
 */

const fs = require('fs')
const path = require('path')

const ENV_FILE = path.join(__dirname, '../.env.local')
const AUTH_MODE_PREFIX = 'NEXT_PUBLIC_AUTH_MODE='
const AUTH_MODE_COMMENT = '# NEXT_PUBLIC_AUTH_MODE='

// Legacy variables for cleanup
const LEGACY_MOCK_AUTH_LINE = 'NEXT_PUBLIC_USE_MOCK_AUTH=true'
const LEGACY_MOCK_AUTH_COMMENT = '# NEXT_PUBLIC_USE_MOCK_AUTH=true'
const LEGACY_LEGACY_AUTH_LINE = 'NEXT_PUBLIC_USE_LEGACY_AUTH=true'
const LEGACY_LEGACY_AUTH_COMMENT = '# NEXT_PUBLIC_USE_LEGACY_AUTH=true'

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
  const lines = content.split('\n')
  
  // Check for new single environment variable
  const authModeLine = lines.find(line => 
    line.trim().startsWith(AUTH_MODE_PREFIX) && !line.trim().startsWith(AUTH_MODE_COMMENT)
  )
  
  if (authModeLine) {
    const mode = authModeLine.split('=')[1]?.trim().toLowerCase()
    if (mode === 'mock' || mode === 'legacy' || mode === 'oauth') {
      return mode
    }
  }
  
  // Check legacy variables for backward compatibility
  const hasMockAuth = lines.some(line => line.trim() === LEGACY_MOCK_AUTH_LINE)
  const hasLegacyAuth = lines.some(line => line.trim() === LEGACY_LEGACY_AUTH_LINE)
  
  if (hasMockAuth) return 'mock'
  if (hasLegacyAuth) return 'legacy'
  return 'oauth'
}

function setAuthMode(mode) {
  let content = readEnvFile()
  
  if (getCurrentMode() === mode) {
    console.log(`✅ Already using ${mode} authentication`)
    return
  }
  
  // Clean up legacy variables
  content = cleanupLegacyVariables(content)
  
  // Set new auth mode variable
  content = setAuthModeVariable(content, mode)
  
  writeEnvFile(content)
  
  switch (mode) {
    case 'mock':
      console.log('✅ Switched to mock authentication')
      console.log('📝 Test credentials:')
      console.log('   admin@spearfish.io / Password123!')
      console.log('   user@spearfish.io / UserPass123!')
      console.log('   test@example.com / TestPass123!')
      break
    case 'legacy':
      console.log('✅ Switched to legacy cookie-based authentication')
      console.log('🍪 Using portal-spearfish style authentication')
      console.log('🔗 Make sure your legacy API server is running on the configured URL')
      break
    case 'oauth':
      console.log('✅ Switched to OAuth 2.0 platform-api authentication')
      console.log('🔗 Make sure your platform-api is running on the configured URL')
      break
  }
  
  console.log('🔄 Restart your dev server to apply changes')
}

function setMockMode() {
  setAuthMode('mock')
}

function setOAuthMode() {
  setAuthMode('oauth')
}

function setLegacyMode() {
  setAuthMode('legacy')
}

function cleanupLegacyVariables(content) {
  // Remove or comment out legacy variables
  content = content.replace(LEGACY_MOCK_AUTH_LINE, LEGACY_MOCK_AUTH_COMMENT)
  content = content.replace(LEGACY_LEGACY_AUTH_LINE, LEGACY_LEGACY_AUTH_COMMENT)
  return content
}

function setAuthModeVariable(content, mode) {
  const lines = content.split('\n')
  const authModeValue = `${AUTH_MODE_PREFIX}${mode}`
  
  // Find existing auth mode line
  const authModeIndex = lines.findIndex(line => 
    line.trim().startsWith(AUTH_MODE_PREFIX) && !line.trim().startsWith(AUTH_MODE_COMMENT)
  )
  
  if (authModeIndex !== -1) {
    // Replace existing line
    lines[authModeIndex] = authModeValue
  } else {
    // Find commented auth mode line
    const commentIndex = lines.findIndex(line => line.trim().startsWith(AUTH_MODE_COMMENT))
    
    if (commentIndex !== -1) {
      // Replace commented line
      lines[commentIndex] = authModeValue
    } else {
      // Add new line after Authentication Mode section
      const authSectionIndex = lines.findIndex(line => 
        line.includes('Authentication Mode')
      )
      
      if (authSectionIndex !== -1) {
        // Find the end of the comment block
        let insertIndex = authSectionIndex + 1
        while (insertIndex < lines.length && lines[insertIndex].trim().startsWith('#')) {
          insertIndex++
        }
        lines.splice(insertIndex, 0, authModeValue)
      } else {
        // Add at the end
        lines.push('', authModeValue)
      }
    }
  }
  
  return lines.join('\n')
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
    console.log('   💡 Run "npm run auth:oauth" to switch to OAuth mode')
    console.log('   💡 Run "npm run auth:legacy" to switch to legacy mode')
  } else if (mode === 'legacy') {
    console.log('   🍪 Using legacy cookie-based authentication')
    console.log('   💡 Run "npm run auth:mock" to switch to mock mode')
    console.log('   💡 Run "npm run auth:oauth" to switch to OAuth mode')
  } else {
    console.log('   🔗 Using OAuth 2.0 platform-api')
    console.log('   💡 Run "npm run auth:mock" to switch to mock mode')
    console.log('   💡 Run "npm run auth:legacy" to switch to legacy mode')
  }
}

// Parse command line arguments
const command = process.argv[2]

switch (command) {
  case 'mock':
    setMockMode()
    break
  case 'oauth':
  case 'real': // Backward compatibility
    setOAuthMode()
    break
  case 'legacy':
    setLegacyMode()
    break
  case 'status':
    showStatus()
    break
  default:
    console.log('Usage:')
    console.log('  npm run auth:mock    - Switch to mock authentication (MSW)')
    console.log('  npm run auth:oauth   - Switch to OAuth platform-api')
    console.log('  npm run auth:legacy  - Switch to legacy cookie-based auth')
    console.log('  npm run auth:status  - Show current authentication mode')
    process.exit(1)
}