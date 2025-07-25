# Platform Web - Modern Next.js Prototype

A modern Next.js 15 web application prototype demonstrating the latest web development best practices and serving as a feasibility study for replacing existing legacy web applications.

## 🚀 Features

- **Next.js 15** with App Router and Turbopack (FOLLOWING LATEST BEST PRACTICES)
- **React 19** with modern concurrent features and Server Components
- **TypeScript** with strict type checking
- **Pure Radix UI Themes** for 100% consistent, accessible design
- **Zero custom CSS** - all styling through Radix UI Themes props
- **WCAG AA** accessibility compliance built-in
- **App Router Special Files** - loading.tsx, error.tsx, not-found.tsx
- **Security headers** and CSP policies
- **Performance optimizations** with bundle analysis
- **Responsive design** using Radix's responsive props

## 📦 Tech Stack

- **Framework**: Next.js 15.4+
- **UI & Design System**: Radix UI Themes 3.2+ (EXCLUSIVE - no custom CSS)
- **Styling**: Pure Radix UI Themes props and CSS variables
- **State Management**: Zustand, React Context
- **Forms**: React Hook Form + Zod validation
- **Icons**: Radix UI Icons
- **Animation**: Framer Motion
- **Type Safety**: TypeScript 5.8+

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking
- `npm run analyze` - Bundle analysis

## 🏗️ Project Structure (Next.js 15 App Router Best Practices)

```
src/
├── app/                    # Next.js App Router (FOLLOWS LATEST STANDARDS)
│   ├── layout.tsx          # Root layout (REQUIRED)
│   ├── page.tsx            # Homepage route
│   ├── loading.tsx         # Global loading UI (SPECIAL FILE)
│   ├── error.tsx           # Global error boundary (SPECIAL FILE) 
│   ├── not-found.tsx       # 404 page (SPECIAL FILE)
│   ├── analytics/          # Route segment
│   │   ├── page.tsx        # /analytics route
│   │   └── loading.tsx     # Route-specific loading
│   └── settings/           # Route segment
│       └── page.tsx        # /settings route
├── components/             # Reusable components
│   ├── ui/                # Pure Radix UI components
│   ├── layout/            # Layout components
│   └── dashboard/         # Feature components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
└── types/                 # TypeScript definitions
```

## 🎯 Key Features Demonstrated

### Modern React Patterns
- Server and Client Components
- Concurrent features and modern hooks
- Component-driven development

### Accessibility (WCAG AA)
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Screen reader compatibility

### Performance Optimizations
- Bundle splitting and lazy loading
- Image optimization with Next.js Image
- Server-side rendering
- Bundle analysis tools

### Security
- Content Security Policy headers
- XSS protection
- Secure referrer policies
- Input validation and sanitization

### Developer Experience
- TypeScript strict mode
- ESLint configuration
- Hot reload with Turbopack
- Component composition patterns

## 📊 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: 210KB initial JS (achieved)

## 🔧 Configuration

The application includes:

- **Security headers** in `next.config.ts`
- **TypeScript** strict configuration
- **Tailwind CSS** with design system integration
- **ESLint** with Next.js best practices

## 📚 Documentation

See `CLAUDE.md` for comprehensive technical documentation, including:

- Architecture principles
- Development guidelines
- Component patterns
- Security considerations
- Performance monitoring
- Migration strategies

## 🚀 Deployment

The application is optimized for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Self-hosted** with Docker

## 🎨 Pure Radix UI Themes Design System

Built **exclusively** with Radix UI Themes providing:

- **Zero custom CSS classes** - all styling through component props
- **Consistent color palette** using Radix color tokens
- **Typography scale** with semantic sizing (size="1" through size="9")
- **Spacing system** using Radix spacing props (p, m, gap, etc.)
- **Accessible components** with built-in WCAG AA compliance
- **Dark/light mode support** through theme configuration
- **CSS variables integration** for advanced styling (var(--blue-9), etc.)
- **Responsive design** through Radix responsive props

## 🧪 Testing Strategy

Prepared for:

- **Unit testing** with Jest and React Testing Library
- **Integration testing** for API and components
- **Accessibility testing** with axe-core
- **E2E testing** with Playwright/Cypress

## 📈 Future Enhancements

Planned features:

- Progressive Web App capabilities
- Internationalization (i18n)
- Advanced analytics
- Storybook integration
- E2E testing suite

## 🤝 Contributing

This is a prototype for evaluation purposes. For production use:

1. Add comprehensive testing
2. Implement proper error boundaries
3. Add monitoring and analytics
4. Set up CI/CD pipelines
5. Add database integration

## 📄 License

This project is for evaluation and demonstration purposes.

---

**Built with ❤️ using Next.js 15, React 19, and Radix UI Themes**
