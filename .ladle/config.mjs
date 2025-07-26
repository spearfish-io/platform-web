import { defineConfig } from '@ladle/react'

/**
 * Ladle Configuration for Platform Web
 * 
 * Configures Ladle for Next.js integration with Radix UI Themes,
 * TypeScript support, and enterprise development workflow.
 */
export default defineConfig({
  // Application title in Ladle interface
  title: 'Platform Web Components',
  
  // Base URL for the Ladle server
  base: '/',
  
  // Port for development server
  port: 61000,
  
  // Open browser automatically when starting
  open: true,
  
  // Enable hot module replacement for faster development
  hmr: true,
  
  // Vite configuration for better Next.js compatibility
  viteConfig: {
    // Resolve configuration for Next.js and TypeScript
    resolve: {
      alias: {
        '@': new URL('../src', import.meta.url).pathname,
      },
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
    },
    
    // Define environment variables for consistency with Next.js
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
    
    // CSS processing configuration
    css: {
      postcss: {
        plugins: [],
      },
    },
    
    // Optimize dependencies for better performance
    optimizeDeps: {
      include: [
        '@radix-ui/themes',
        '@radix-ui/react-icons',
        'next-auth/react',
        'framer-motion',
      ],
    },
    
    // ESBuild configuration for TypeScript
    esbuild: {
      target: 'es2020',
      format: 'esm',
    },
  },
  
  // Story configuration
  stories: 'src/**/*.stories.{js,jsx,ts,tsx}',
  
  // Default viewport sizes for responsive testing
  defaultViewport: 'responsive',
  
  // Custom viewports for different screen sizes
  viewports: {
    mobile: {
      label: 'Mobile',
      width: 375,
      height: 667,
    },
    tablet: {
      label: 'Tablet', 
      width: 768,
      height: 1024,
    },
    desktop: {
      label: 'Desktop',
      width: 1200,
      height: 800,
    },
    wide: {
      label: 'Wide Screen',
      width: 1440,
      height: 900,
    },
  },
  
  // Addons configuration
  addons: {
    // Enable accessibility addon for enterprise compliance
    a11y: {
      enabled: true,
    },
    
    // Enable controls for interactive component testing
    controls: {
      enabled: true,
    },
    
    // Enable actions addon for event handling testing
    actions: {
      enabled: true,
    },
  },
  
  // Build configuration for production builds
  build: {
    // Output directory for built stories
    outDir: '.ladle/build',
    
    // Base path for deployment
    publicPath: '/',
  },
  
  // Development server configuration
  serve: {
    // Host configuration for team access
    host: true,
    
    // CORS configuration for API integration
    cors: true,
  },
})