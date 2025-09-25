#!/usr/bin/env tsx

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

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ENV_FILE = path.join(__dirname, '../.env.local')
const AUTH_MODE_PREFIX = 'NEXT_PUBLIC_AUTH_MODE='
const AUTH_MODE_COMMENT = '# NEXT_PUBLIC_AUTH_MODE='

type AuthMode = 'mock' | 'oauth' | 'legacy'

interface Credentials {
  email: string
  password: string
  description?: string
}

const mockCredentials: Credentials[] = [
  { email: 'admin@spearfish.io', password: 'Password123!', description: 'Admin user' },
  { email: 'user@spearfish.io', password: 'UserPass123!', description: 'Regular user' },
  { email: 'test@example.com', password: 'TestPass123!', description: 'Test user' }
]

function readEnvFile(): string {
  try {
    return fs.readFileSync(ENV_FILE, 'utf8')
  } catch (error) {
    console.error('❌ Could not read .env.local file:', (error as Error).message)
    process.exit(1)
  }
}

function writeEnvFile(content: string): void {
  try {
    fs.writeFileSync(ENV_FILE, content, 'utf8')
  } catch (error) {
    console.error('❌ Could not write .env.local file:', (error as Error).message)
    process.exit(1)
  }
}

function getCurrentMode(): AuthMode {
  const content = readEnvFile()
  const lines = content.split('\n')
  
  // Check for environment variable
  const authModeLine = lines.find(line => 
    line.trim().startsWith(AUTH_MODE_PREFIX) && !line.trim().startsWith(AUTH_MODE_COMMENT)
  )
  
  if (authModeLine) {
    const mode = authModeLine.split('=')[1]?.trim().toLowerCase()
    if (mode === 'mock' || mode === 'legacy' || mode === 'oauth') {
      return mode as AuthMode
    }
  }
  
  // Default to oauth if not specified
  return 'oauth'
}

function setAuthModeVariable(content: string, mode: AuthMode): string {
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

function setAuthMode(mode: AuthMode): void {
  const content = readEnvFile()
  
  if (getCurrentMode() === mode) {
    console.log(`✅ Already using ${mode} authentication`)
    return
  }
  
  // Set new auth mode variable
  const updatedContent = setAuthModeVariable(content, mode)
  
  writeEnvFile(updatedContent)
  
  switch (mode) {
    case 'mock':
      console.log('✅ Switched to mock authentication')
      console.log('📝 Test credentials:')
      mockCredentials.forEach(cred => {
        console.log(`   ${cred.email} / ${cred.password}${cred.description ? ` (${cred.description})` : ''}`)
      })
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

function showStatus(): void {
  const mode = getCurrentMode()
  const content = readEnvFile()
  const apiUrl = content.match(/NEXT_PUBLIC_API_URL=(.+)/)?.[1] || 'not set'
  
  console.log('🔧 Current Authentication Configuration:')
  console.log(`   Mode: ${mode}`)
  console.log(`   API URL: ${apiUrl}`)
  
  switch (mode) {
    case 'mock':
      console.log('   📝 Test credentials available for mock mode')
      console.log('   💡 Run "npm run auth:oauth" to switch to OAuth mode')
      console.log('   💡 Run "npm run auth:legacy" to switch to legacy mode')
      break
    case 'legacy':
      console.log('   🍪 Using legacy cookie-based authentication')
      console.log('   💡 Run "npm run auth:mock" to switch to mock mode')
      console.log('   💡 Run "npm run auth:oauth" to switch to OAuth mode')
      break
    case 'oauth':
    default:
      console.log('   🔗 Using OAuth 2.0 platform-api')
      console.log('   💡 Run "npm run auth:mock" to switch to mock mode')
      console.log('   💡 Run "npm run auth:legacy" to switch to legacy mode')
      break
  }
}

// Parse command line arguments
const command = process.argv[2]

switch (command) {
  case 'mock':
    setAuthMode('mock')
    break
  case 'oauth':
    setAuthMode('oauth')
    break
  case 'legacy':
    setAuthMode('legacy')
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