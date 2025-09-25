/**
 * Authentication Form Layout Component
 * 
 * Shared layout component for all authentication forms providing consistent structure,
 * branding, and accessibility. Built with Pure Radix UI Themes.
 */

'use client'

import { Card, Flex, Box, Heading, Text, Separator } from '@radix-ui/themes'
import { Shield } from 'lucide-react'

export interface AuthFormLayoutProps {
  /**
   * Form title (e.g., "Sign In", "Choose Account")
   */
  title: string
  
  /**
   * Optional subtitle or description
   */
  subtitle?: string
  
  /**
   * Authentication mode for contextual messaging
   */
  mode?: 'oauth' | 'legacy' | 'mock'
  
  /**
   * Form content
   */
  children: React.ReactNode
  
  /**
   * Footer content (links, legal text, etc.)
   */
  footer?: React.ReactNode
  
  /**
   * Show Spearfish branding
   */
  showBranding?: boolean
  
  /**
   * Component size
   */
  size?: '1' | '2' | '3'
  
  /**
   * Additional styling
   */
  style?: React.CSSProperties
}

/**
 * Consistent authentication form layout
 */
export function AuthFormLayout({
  title,
  subtitle,
  mode,
  children,
  footer,
  showBranding = true,
  size = '2',
  style
}: AuthFormLayoutProps) {
  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      style={{ 
        minHeight: '100vh',
        padding: 'var(--space-4)',
        ...style 
      }}
    >
      <Card 
        size={size === '3' ? '4' : size === '2' ? '3' : '2'}
        style={{ 
          width: '100%',
          maxWidth: size === '3' ? '500px' : size === '2' ? '400px' : '350px'
        }}
      >
        <Flex direction="column" gap={size === '3' ? '5' : '4'}>
          {/* Header Section */}
          <Flex direction="column" align="center" gap="3">
            {/* Branding */}
            {showBranding && (
              <Flex direction="column" align="center" gap="2">
                <Box style={{ color: 'var(--blue-9)' }}>
                  <Shield 
                    style={{ 
                      width: size === '3' ? '40px' : '32px', 
                      height: size === '3' ? '40px' : '32px' 
                    }}
                    aria-hidden="true"
                  />
                </Box>
                <Text 
                  size={size === '3' ? '4' : '3'} 
                  weight="bold" 
                  color="blue"
                >
                  Spearfish Platform
                </Text>
              </Flex>
            )}
            
            {/* Title Section */}
            <Flex direction="column" align="center" gap="1">
              <Heading 
                size={size === '3' ? '6' : size === '2' ? '5' : '4'}
                weight="bold"
                align="center"
              >
                {title}
              </Heading>
              
              {subtitle && (
                <Text 
                  size={size === '3' ? '3' : '2'} 
                  color="gray" 
                  align="center"
                  style={{ maxWidth: '350px' }}
                >
                  {subtitle}
                </Text>
              )}
              
              {/* Mode-specific messaging */}
              {mode && (
                <Text 
                  size="1" 
                  color="gray" 
                  align="center"
                  style={{ 
                    marginTop: 'var(--space-2)',
                    fontStyle: 'italic'
                  }}
                >
                  {getModeDescription(mode)}
                </Text>
              )}
            </Flex>
            
            {showBranding && <Separator size="4" />}
          </Flex>

          {/* Form Content */}
          <Box>
            {children}
          </Box>

          {/* Footer Section */}
          {footer && (
            <>
              <Separator size="4" />
              <Box>
                {footer}
              </Box>
            </>
          )}
        </Flex>
      </Card>

      {/* Security Notice */}
      <Flex 
        direction="column" 
        align="center" 
        gap="2" 
        mt="4"
        style={{ maxWidth: '400px' }}
      >
        <Flex align="center" gap="2">
          <Shield 
            style={{ 
              width: '16px', 
              height: '16px', 
              color: 'var(--gray-9)' 
            }}
            aria-hidden="true"
          />
          <Text size="1" color="gray" weight="medium">
            Secure Authentication
          </Text>
        </Flex>
        
        <Text size="1" color="gray" align="center">
          Your connection is encrypted and your data is protected by enterprise-grade security.
        </Text>
      </Flex>
    </Flex>
  )
}

/**
 * Get mode-specific description text
 */
function getModeDescription(mode: 'oauth' | 'legacy' | 'mock'): string {
  const descriptions = {
    oauth: 'Secure OAuth 2.0 authentication',
    legacy: 'Traditional email and password login',
    mock: 'Development mode with test credentials'
  }
  
  return descriptions[mode]
}

/**
 * Pre-configured layouts for specific authentication modes
 */

export function OIDCFormLayout({ children, ...props }: Omit<AuthFormLayoutProps, 'mode'>) {
  return (
    <AuthFormLayout 
      {...props} 
      mode="oauth"
      title="Sign In to Your Account"
      subtitle="Choose your preferred sign-in method"
    >
      {children}
    </AuthFormLayout>
  )
}

export function LegacyFormLayout({ children, ...props }: Omit<AuthFormLayoutProps, 'mode'>) {
  return (
    <AuthFormLayout 
      {...props} 
      mode="legacy"
      title="Sign In"
      subtitle="Enter your credentials to access your account"
    >
      {children}
    </AuthFormLayout>
  )
}

export function MockFormLayout({ children, ...props }: Omit<AuthFormLayoutProps, 'mode'>) {
  return (
    <AuthFormLayout 
      {...props} 
      mode="mock"
      title="Development Sign In"
      subtitle="Use test credentials for development and testing"
    >
      {children}
    </AuthFormLayout>
  )
}

/**
 * Authentication form footer with common links and legal text
 */
interface AuthFormFooterProps {
  showSupportLink?: boolean
  showPrivacyLink?: boolean
  showTermsLink?: boolean
  customLinks?: Array<{ label: string; href: string }>
  size?: '1' | '2' | '3'
}

export function AuthFormFooter({
  showSupportLink = true,
  showPrivacyLink = true,
  showTermsLink = true,
  customLinks = [],
  size = '2'
}: AuthFormFooterProps) {
  const allLinks = [
    ...(showSupportLink ? [{ label: 'Support', href: '/support' }] : []),
    ...(showPrivacyLink ? [{ label: 'Privacy', href: '/privacy' }] : []),
    ...(showTermsLink ? [{ label: 'Terms', href: '/terms' }] : []),
    ...customLinks
  ]

  return (
    <Flex direction="column" gap="3" align="center">
      {/* Links */}
      {allLinks.length > 0 && (
        <Flex gap="3" wrap="wrap" justify="center">
          {allLinks.map((link, index) => (
            <Text key={index} size="1">
              <a 
                href={link.href}
                style={{ 
                  color: 'var(--gray-11)',
                  textDecoration: 'none'
                }}
              >
                {link.label}
              </a>
            </Text>
          ))}
        </Flex>
      )}
      
      {/* Copyright */}
      <Text size="1" color="gray" align="center">
        © 2024 Spearfish. All rights reserved.
      </Text>
    </Flex>
  )
}