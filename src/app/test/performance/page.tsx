"use client";

import * as React from "react";
import { 
  Container, 
  Heading, 
  Text, 
  Grid, 
  Flex, 
  Box, 
  Card,
  Separator,
  Badge,
  Button,
  Progress
} from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";
import { 
  PerformanceMetric, 
  CoreWebVitals,
  CodeExample 
} from "@/components/test-pages";
import { 
  StopwatchIcon,
  BarChartIcon,
  RocketIcon,
  EyeOpenIcon,
  TargetIcon,
  ActivityLogIcon
} from "@radix-ui/react-icons";

// Mock performance data - in real app this would come from actual measurements
const mockPerformanceData = {
  lcp: 1.2, // seconds
  fid: 85,  // milliseconds
  cls: 0.08, // score
  fcp: 0.9, // seconds
  ttfb: 450, // milliseconds
};

const bundleData = {
  totalSize: 245000, // bytes
  jsSize: 180000,
  cssSize: 32000,
  htmlSize: 8000,
  imagesSize: 25000,
};

export default function PerformancePage() {
  const bundleAnalysisCode = `// Bundle analysis with Next.js Bundle Analyzer
// package.json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}

// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  // Next.js config
});`;

  const imagePerfCode = `import Image from 'next/image';

// Optimized image loading
<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // Above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Lazy loading for below-the-fold
<Image
  src="/content-image.jpg"
  alt="Content image"
  width={400}
  height={300}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>`;

  const codeSplittingCode = `// Route-based code splitting (automatic in Next.js App Router)
// Each page is automatically split into separate bundles

// Component-based code splitting
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Disable SSR for client-only components
});

// Conditional loading
const ChartComponent = dynamic(() => import('./Chart'), {
  loading: () => <div>Loading chart...</div>,
});

function Dashboard() {
  const [showChart, setShowChart] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowChart(true)}>
        Load Chart
      </Button>
      {showChart && <ChartComponent />}
    </div>
  );
}`;

  const serverComponentPerfCode = `// Server Components reduce client-side JavaScript
export default async function ServerPage() {
  // This runs on the server - no client bundle impact
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  
  return (
    <Container>
      {posts.map(post => (
        <Card key={post.id}>
          <Heading>{post.title}</Heading>
          <Text>{post.excerpt}</Text>
          {/* Only interactive parts need 'use client' */}
          <InteractiveButton postId={post.id} />
        </Card>
      ))}
    </Container>
  );
}

// Client Component only for interactivity
'use client'
function InteractiveButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  
  return (
    <Button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} Like
    </Button>
  );
}`;

  const otelCode = `// OpenTelemetry integration for monitoring
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node');
  }
}

// Custom performance tracking
import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('platform-web');

export function trackUserAction(action: string) {
  const span = tracer.startSpan(\`user.\${action}\`);
  
  span.setAttributes({
    'user.action': action,
    'app.version': process.env.npm_package_version,
  });
  
  // Measure execution time
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      span.setAttributes({ 'performance.duration': duration });
      span.end();
    }
  };
}`;

  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header */}
        <Box mb="8">
          <Heading size="9" mb="3">
            Performance & Optimization
          </Heading>
          <Text size="4" color="gray" mb="4">
            Real-time performance metrics, optimization techniques, and monitoring tools
          </Text>
          
          <Flex align="center" gap="2" wrap="wrap">
            <Badge variant="soft" color="blue" size="2">
              Core Web Vitals
            </Badge>
            <Badge variant="soft" color="green" size="2">
              Bundle Analysis
            </Badge>
            <Badge variant="soft" color="purple" size="2">
              OpenTelemetry
            </Badge>
            <Badge variant="soft" color="orange" size="2">
              Performance Budget
            </Badge>
          </Flex>
        </Box>

        {/* Core Web Vitals */}
        <Box mb="8">
          <Heading size="6" mb="4">Core Web Vitals</Heading>
          <Text size="3" color="gray" mb="6">
            Current performance metrics for this application. These are measured in real-time 
            and tracked across all user sessions.
          </Text>
          
          <CoreWebVitals {...mockPerformanceData} />
        </Box>

        <Separator size="4" mb="8" />

        {/* Bundle Analysis */}
        <Box mb="8">
          <Heading size="6" mb="4">Bundle Analysis</Heading>
          
          <Grid columns={{ initial: "1", lg: "2" }} gap="6" mb="6">
            <Box>
              <Heading size="4" mb="4">Bundle Composition</Heading>
              <Grid columns={{ initial: "2" }} gap="3">
                <PerformanceMetric
                  name="JavaScript"
                  value={bundleData.jsSize}
                  unit="bytes"
                  target={250000}
                  type="size"
                  status="good"
                  description="Main application bundle"
                />
                <PerformanceMetric
                  name="CSS"
                  value={bundleData.cssSize}
                  unit="bytes"
                  target={50000}
                  type="size"
                  status="good"
                  description="Stylesheet bundle"
                />
                <PerformanceMetric
                  name="Images"
                  value={bundleData.imagesSize}
                  unit="bytes"
                  target={100000}
                  type="size"
                  status="good"
                  description="Optimized images"
                />
                <PerformanceMetric
                  name="Total"
                  value={bundleData.totalSize}
                  unit="bytes"
                  target={500000}
                  type="size"
                  status="good"
                  description="Total bundle size"
                />
              </Grid>
            </Box>

            <Box>
              <Heading size="4" mb="4">Performance Budget</Heading>
              <Card size="3">
                <Flex direction="column" gap="4">
                  <Box>
                    <Flex align="center" justify="between" mb="2">
                      <Text size="2" weight="medium">JavaScript Bundle</Text>
                      <Text size="2" color="gray">180KB / 250KB</Text>
                    </Flex>
                    <Progress value={72} color="green" size="2" />
                  </Box>
                  
                  <Box>
                    <Flex align="center" justify="between" mb="2">
                      <Text size="2" weight="medium">CSS Bundle</Text>
                      <Text size="2" color="gray">32KB / 50KB</Text>
                    </Flex>
                    <Progress value={64} color="green" size="2" />
                  </Box>
                  
                  <Box>
                    <Flex align="center" justify="between" mb="2">
                      <Text size="2" weight="medium">Total Resources</Text>
                      <Text size="2" color="gray">245KB / 500KB</Text>
                    </Flex>
                    <Progress value={49} color="green" size="2" />
                  </Box>
                  
                  <Badge variant="soft" color="green" size="1">
                    Within Performance Budget
                  </Badge>
                </Flex>
              </Card>
            </Box>
          </Grid>

          <CodeExample
            title="Bundle Analysis Setup"
            description="Configure Next.js Bundle Analyzer for detailed bundle insights"
            code={bundleAnalysisCode}
          />
        </Box>

        <Separator size="4" mb="8" />

        {/* Optimization Techniques */}
        <Box mb="8">
          <Heading size="6" mb="4">Optimization Techniques</Heading>
          
          <Grid columns={{ initial: "1", md: "2" }} gap="4" mb="6">
            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--blue-9)" }}>
                  <RocketIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Server Components</Heading>
                  <Text size="2" color="gray" mb="3">
                    Reduce client-side JavaScript by using Server Components. 
                    Only use Client Components for interactivity.
                  </Text>
                  <Badge variant="soft" color="blue" size="1">React 19</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--green-9)" }}>
                  <EyeOpenIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Image Optimization</Heading>
                  <Text size="2" color="gray" mb="3">
                    Next.js Image component with WebP/AVIF support, lazy loading, 
                    and responsive sizing for optimal performance.
                  </Text>
                  <Badge variant="soft" color="green" size="1">Next.js 15</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--purple-9)" }}>
                  <TargetIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Code Splitting</Heading>
                  <Text size="2" color="gray" mb="3">
                    Automatic route-based splitting plus dynamic imports for 
                    component-level splitting and conditional loading.
                  </Text>
                  <Badge variant="soft" color="purple" size="1">Bundle Optimization</Badge>
                </Box>
              </Flex>
            </Card>

            <Card size="3">
              <Flex align="start" gap="3">
                <Box style={{ color: "var(--orange-9)" }}>
                  <ActivityLogIcon style={{ width: "20px", height: "20px" }} />
                </Box>
                <Box>
                  <Heading size="4" mb="2">Performance Monitoring</Heading>
                  <Text size="2" color="gray" mb="3">
                    OpenTelemetry integration with Dash0 for comprehensive 
                    performance tracking and real-time monitoring.
                  </Text>
                  <Badge variant="soft" color="orange" size="1">Observability</Badge>
                </Box>
              </Flex>
            </Card>
          </Grid>
        </Box>

        {/* Code Examples */}
        <Box mb="8">
          <Heading size="6" mb="4">Implementation Examples</Heading>
          
          <Grid columns={{ initial: "1" }} gap="6">
            <CodeExample
              title="Image Optimization"
              description="Proper Next.js Image component usage for optimal performance"
              code={imagePerfCode}
            />

            <CodeExample
              title="Code Splitting Strategies"
              description="Dynamic imports and conditional loading for reduced bundle sizes"
              code={codeSplittingCode}
            />

            <CodeExample
              title="Server Components Performance"
              description="Minimize client-side JavaScript with Server Components"
              code={serverComponentPerfCode}
            />
          </Grid>
        </Box>

        <Separator size="4" mb="8" />

        {/* Monitoring & Observability */}
        <Box mb="8">
          <Heading size="6" mb="4">Performance Monitoring</Heading>
          
          <Grid columns={{ initial: "1", lg: "2" }} gap="6" mb="6">
            <Box>
              <Heading size="4" mb="3">Real-User Monitoring (RUM)</Heading>
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Badge variant="soft" color="green" size="1">Active</Badge>
                    <Text size="2">OpenTelemetry + Dash0</Text>
                  </Flex>
                  
                  <Text size="2" color="gray">
                    Collecting performance metrics from real user sessions across 
                    different browsers, devices, and network conditions.
                  </Text>
                  
                  <Flex gap="2" wrap="wrap">
                    <Badge variant="outline" size="1">Core Web Vitals</Badge>
                    <Badge variant="outline" size="1">Custom Metrics</Badge>
                    <Badge variant="outline" size="1">Error Tracking</Badge>
                  </Flex>
                </Flex>
              </Card>
            </Box>

            <Box>
              <Heading size="4" mb="3">Performance Alerts</Heading>
              <Card size="3">
                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <Badge variant="soft" color="blue" size="1">Configured</Badge>
                    <Text size="2">Automated Monitoring</Text>
                  </Flex>
                  
                  <Text size="2" color="gray">
                    Automated alerts when performance metrics exceed thresholds. 
                    Integrated with development workflow for quick response.
                  </Text>
                  
                  <Flex gap="2" wrap="wrap">
                    <Badge variant="outline" size="1">LCP &gt; 2.5s</Badge>
                    <Badge variant="outline" size="1">Bundle &gt; 500KB</Badge>
                    <Badge variant="outline" size="1">Error Rate &gt; 1%</Badge>
                  </Flex>
                </Flex>
              </Card>
            </Box>
          </Grid>

          <CodeExample
            title="Performance Tracking Integration"
            description="Custom performance tracking with OpenTelemetry"
            code={otelCode}
          />
        </Box>

        {/* Performance Targets */}
        <Box mb="8">
          <Heading size="6" mb="4">Performance Targets & Budgets</Heading>
          
          <Grid columns={{ initial: "1", lg: "2" }} gap="4">
            <Card size="3" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
              <Heading size="4" color="green" mb="3">✅ Current Targets</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="green">• First Contentful Paint: &lt; 1.5s</Text>
                <Text size="2" color="green">• Largest Contentful Paint: &lt; 2.5s</Text>
                <Text size="2" color="green">• Cumulative Layout Shift: &lt; 0.1</Text>
                <Text size="2" color="green">• First Input Delay: &lt; 100ms</Text>
                <Text size="2" color="green">• Bundle Size: &lt; 250KB initial JS</Text>
              </Flex>
            </Card>

            <Card size="3" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
              <Heading size="4" color="blue" mb="3">🎯 Optimization Goals</Heading>
              <Flex direction="column" gap="2">
                <Text size="2" color="blue">• Achieve 95+ Lighthouse score</Text>
                <Text size="2" color="blue">• Sub-second Time to Interactive</Text>
                <Text size="2" color="blue">• Zero layout shifts during loading</Text>
                <Text size="2" color="blue">• Progressive enhancement support</Text>
                <Text size="2" color="blue">• Edge deployment optimization</Text>
              </Flex>
            </Card>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Heading size="5" mb="4">Performance Tools</Heading>
          <Flex gap="3" wrap="wrap">
            <Button variant="solid" onClick={() => window.open('https://pagespeed.web.dev/', '_blank')}>
              PageSpeed Insights
            </Button>
            <Button variant="soft" onClick={() => alert('Bundle analysis: npm run analyze')}>
              Analyze Bundle
            </Button>
            <Button variant="soft" asChild>
              <a href="/design-system">Design System</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/components">Component Library</a>
            </Button>
          </Flex>
        </Box>
      </Container>
    </AppShell>
  );
}