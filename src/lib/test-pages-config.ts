/**
 * Test Pages Configuration
 * 
 * Controls access to design system test pages based on environment.
 * Ensures test pages are only available in local development.
 */

export interface TestPagesConfig {
  enabled: boolean;
  showInNavigation: boolean;
  allowAccess: boolean;
  environment: string;
}

/**
 * Get test pages configuration based on current environment
 */
export function getTestPagesConfig(): TestPagesConfig {
  const nodeEnv = process.env.NODE_ENV;
  const isLocal = nodeEnv === 'development';
  const isAzure = !!(process.env.AZURE_CLIENT_ID || process.env.WEBSITE_SITE_NAME);
  const isVercelProd = process.env.VERCEL_ENV === 'production';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';
  
  // Determine environment
  let environment = 'unknown';
  if (isLocal) environment = 'local';
  else if (isAzure) environment = 'azure';
  else if (isVercelProd) environment = 'vercel-production';
  else if (isVercelPreview) environment = 'vercel-preview';
  
  // Only enable test pages in local development
  const enabled = isLocal;
  
  return {
    enabled,
    showInNavigation: enabled,
    allowAccess: enabled,
    environment
  };
}

/**
 * List of test page routes
 */
export const TEST_PAGE_ROUTES = [
  '/test',
  '/test/design-system',
  '/test/components', 
  '/test/patterns',
  '/test/performance',
  '/test/accessibility',
  '/test/auth-demo'
] as const;

/**
 * Check if a path is a test page
 */
export function isTestPage(pathname: string): boolean {
  return TEST_PAGE_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Get error message for blocked test pages
 */
export function getTestPageBlockedMessage(environment: string): string {
  switch (environment) {
    case 'azure':
      return 'Design system test pages are not available in Azure environments.';
    case 'vercel-production':
      return 'Design system test pages are not available in production.';
    case 'vercel-preview':
      return 'Design system test pages are not available in preview deployments.';
    default:
      return 'Design system test pages are only available in local development.';
  }
}