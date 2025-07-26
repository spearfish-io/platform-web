/**
 * Vite Configuration for Ladle
 * 
 * Configures environment variables and build settings for component development
 */

import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default {
  define: {
    // Define Node.js environment variables for browser context
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.NEXT_PUBLIC_APP_URL': JSON.stringify('http://localhost:3000'),
    'process.env.VERCEL_ENV': JSON.stringify(undefined),
    'process.env.AZURE_CLIENT_ID': JSON.stringify(undefined),
    'process.env.WEBSITE_SITE_NAME': JSON.stringify(undefined),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
};