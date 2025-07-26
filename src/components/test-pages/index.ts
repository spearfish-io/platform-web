// Test page components for design system documentation and canary testing

export { 
  DesignToken, 
  ColorToken, 
  SpaceToken, 
  TypographyToken 
} from './design-token';

export { ComponentShowcase } from './component-showcase';

export { 
  CodeExample, 
  InlineCode, 
  CodeBlock 
} from './code-example';

export { 
  PerformanceMetric, 
  CoreWebVitals 
} from './performance-metric';

export { 
  AccessibilityTest, 
  WCAGChecklist 
} from './accessibility-test';

export {
  StateManagementExample,
  AccessibleForm,
  ColorContrastDemo,
  KeyboardNavigationDemo
} from './interactive-examples';

// Re-export types for consumers
export type { AccessibilityCheckResult } from './accessibility-test';