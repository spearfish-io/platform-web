/**
 * Ladle Configuration for Platform Web
 * 
 * Configures Ladle for Next.js integration with Radix UI Themes,
 * TypeScript support, and enterprise development workflow.
 */
export default {
  // Application title in Ladle interface
  title: 'Platform Web Components',
  
  // Port for development server
  port: 61000,
  
  // Story configuration
  stories: 'src/**/*.stories.tsx',
  
  // Vite configuration for browser environment
  viteConfig: './ladle.vite.config.mjs',
  
  // Addons configuration
  addons: {
    // Enable controls for interactive component testing
    control: {
      enabled: true,
    },
    
    // Theme addon
    theme: {
      enabled: true,
      defaultState: 'light',
    },
    
    // Width addon for responsive testing
    width: {
      enabled: true,
      options: {
        mobile: 375,
        tablet: 768,
        desktop: 1200,
        wide: 1440,
      },
      defaultState: 0, // responsive by default
    },
    
    // Source code addon
    source: {
      enabled: true,
      defaultState: false,
    },
  },
}