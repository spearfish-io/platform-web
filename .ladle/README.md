# Ladle Component Development

This directory contains the configuration and setup for **Ladle**, our React component development and documentation tool.

## What is Ladle?

Ladle is a fast, modern alternative to Storybook that's specifically built for React applications. It uses Vite and SWC for superior performance and is designed to work seamlessly with our Next.js and Radix UI Themes setup.

## Quick Start

```bash
# Start Ladle development server
npm run ladle

# Build static version for deployment
npm run ladle:build

# Preview built version
npm run ladle:preview
```

## Key Features

- **⚡ Fast Performance**: Built with Vite + SWC for instant hot reload
- **🎨 Radix UI Integration**: Pre-configured with our design system
- **🌙 Theme Support**: Light/dark theme switcher built-in
- **📱 Responsive Testing**: Multiple viewport sizes for testing
- **♿ Accessibility**: Built-in a11y testing capabilities
- **🔧 TypeScript**: Full TypeScript support out of the box

## File Structure

```
.ladle/
├── config.mjs          # Main Ladle configuration
├── components.tsx      # Global providers (Radix UI Theme)
└── README.md          # This file

src/
├── components/
│   ├── ui/
│   │   ├── button.stories.tsx      # Button component stories
│   │   └── card.stories.tsx        # Card component stories
│   └── dashboard/
│       └── metric-card.stories.tsx # MetricCard stories
```

## Writing Stories

Stories follow this pattern:

```typescript
import type { Story } from "@ladle/react"
import { YourComponent } from "./your-component"

export default {
  title: "Category/ComponentName",
  component: YourComponent,
}

export const Default: Story = (args) => (
  <YourComponent {...args}>
    Content here
  </YourComponent>
)

Default.args = {
  prop1: "value1",
  prop2: "value2",
}
```

## Available Controls

Our Ladle setup provides these global controls:

- **Theme Toggle**: Switch between light and dark themes
- **Viewport Selector**: Test on mobile, tablet, desktop, and wide screen sizes
- **Component Props**: Interactive controls for each component's properties

## Configuration Highlights

### Theme Integration
- Automatic Radix UI Themes provider wrapping
- Consistent styling with the main application
- Theme switching capability for testing

### Performance Optimizations
- SWC compiler for 2x faster builds
- Vite hot module replacement
- Optimized dependencies pre-bundling

### Enterprise Features
- TypeScript support throughout
- Accessibility testing integration
- Responsive design testing
- Professional UI suitable for client demos

## Team Workflow

### For Developers
1. **Create Components**: Build your React components as usual
2. **Write Stories**: Create `.stories.tsx` files alongside components
3. **Test Variants**: Use Ladle to test different props and states
4. **Review Design**: Share Ladle URL with designers for feedback

### For Designers
1. **Access Ladle**: Visit `http://localhost:61000` when server is running
2. **Browse Components**: Navigate through the component tree
3. **Test Themes**: Use theme toggle to see light/dark versions
4. **Check Responsive**: Use viewport controls for different screen sizes
5. **Provide Feedback**: Comment on component variations and states

### For QA Teams
1. **Component Testing**: Test components in isolation
2. **Accessibility**: Use built-in a11y testing features
3. **Cross-browser**: Test components across different browsers
4. **Edge Cases**: Verify component behavior with extreme props

## Deployment

To deploy Ladle for team access:

```bash
# Build static version
npm run ladle:build

# Deploy the .ladle/build directory to your hosting service
# (Vercel, Netlify, S3, etc.)
```

## Best Practices

### Story Organization
- Group related components in the same category
- Use descriptive story names (Default, WithIcon, Loading, etc.)
- Include edge cases and error states

### Documentation
- Add descriptions to story parameters
- Document prop types with controls
- Include usage examples and guidelines

### Testing
- Test all component variants
- Include loading and error states
- Verify accessibility with different themes
- Test responsive behavior across viewports

## Troubleshooting

### Common Issues

**Build Errors**:
- Ensure all imports are correctly typed
- Check that Radix UI components are properly imported
- Verify TypeScript configuration matches main project

**Theme Issues**:
- Confirm `globals.css` is imported in `components.tsx`
- Check Radix UI Themes provider configuration
- Verify CSS custom properties are available

**Performance Issues**:
- Use `npm run ladle:build` for production testing
- Check browser developer tools for specific bottlenecks
- Consider reducing story complexity for better performance

## Integration with Main App

Ladle shares the same configuration as your main Next.js application:

- **TypeScript Config**: Uses the same tsconfig.json
- **Path Aliases**: `@/` alias works the same way
- **Styling**: Same Radix UI Themes and global CSS
- **Dependencies**: Shares the same node_modules

This ensures component behavior in Ladle matches exactly what users see in the application.

## Security Note

Ladle is designed for development and documentation purposes. Unlike Storybook, it has a much smaller dependency footprint, reducing potential security vulnerabilities while providing excellent performance for enterprise teams.