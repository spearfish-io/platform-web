import * as React from "react";
import { redirect } from "next/navigation";
import { Container, Grid, Heading, Text, Card, Flex, Box } from "@radix-ui/themes";
import { 
  DashboardIcon, 
  PersonIcon, 
  BarChartIcon, 
  ActivityLogIcon 
} from "@radix-ui/react-icons";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { getCurrentSession } from "@/lib/auth-utils";
import { getAuthMode } from "@/lib/auth-mode";
import { cookies } from "next/headers";
import type { DashboardMetric } from "@/types";

const mockMetrics: DashboardMetric[] = [
  {
    id: "1",
    title: "Total Users",
    value: 12345,
    change: { value: 12.5, type: "increase" },
    icon: PersonIcon,
  },
  {
    id: "2",
    title: "Active Sessions",
    value: 1234,
    change: { value: 8.2, type: "increase" },
    icon: ActivityLogIcon,
  },
  {
    id: "3",
    title: "Conversion Rate",
    value: "3.2%",
    change: { value: -2.1, type: "decrease" },
    icon: BarChartIcon,
  },
  {
    id: "4",
    title: "Revenue",
    value: "$45,678",
    change: { value: 15.3, type: "increase" },
    icon: DashboardIcon,
  },
];

export default async function DashboardPage() {
  // Check authentication - redirect to login if not authenticated
  const authMode = getAuthMode();
  let session = null;
  
  if (authMode === 'legacy') {
    // For legacy mode, check for authentication cookies directly
    const cookieStore = cookies();
    const hasAuthCookie = cookieStore.has('.Spearfish.Identity');
    
    if (hasAuthCookie) {
      session = {
        user: {
          id: 'legacy-user',
          email: 'legacy@spearfish.io', 
          name: 'Legacy User',
          authType: 'legacy'
        }
      };
    }
  } else {
    // For OAuth/OIDC modes, use NextAuth
    session = await getCurrentSession();
  }
  
  if (!session?.user) {
    console.log('🔥 No session found, redirecting to login');
    redirect('/auth/signin');
  }
  
  console.log('🔥 User authenticated:', session.user.email, 'Auth Type:', session.user.authType || 'unknown');
  
  return (
    <AppShell>
      <Container size="4" p="6">
        <Box mb="6" data-testid="dashboard-overview">
          <Heading size="8" mb="2">
            Platform Dashboard
          </Heading>
          <Text size="4" color="gray">
            Welcome to your modern Next.js application prototype
          </Text>
        </Box>

        <Grid columns={{ initial: "1", sm: "2", lg: "4" }} gap="4">
          {mockMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </Grid>

        <Grid columns={{ initial: "1", lg: "2" }} gap="6">
          <ChartCard
            title="Analytics Overview"
            description="Your application metrics at a glance"
          >
            <div className="text-center text-gray-500 text-sm">
              Chart visualization placeholder
            </div>
          </ChartCard>
          <ChartCard
            title="User Activity"
            description="Recent user engagement trends"
          >
            <div className="text-center text-gray-500 text-sm">
              Chart visualization placeholder
            </div>
          </ChartCard>
        </Grid>

        <Card size="3" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
          <Flex align="start" gap="4" p="4">
            <Box style={{ width: "24px", height: "24px", color: "var(--blue-9)" }}>
              <DashboardIcon />
            </Box>
            <Box>
              <Heading size="4" color="blue" mb="2">
                Modern Next.js Prototype
              </Heading>
              <Text size="3" color="blue" mb="3">
                This application demonstrates modern web development best practices using:
              </Text>
              <Box>
                <Text size="2" color="blue">• Next.js 15 with App Router</Text><br />
                <Text size="2" color="blue">• TypeScript for type safety</Text><br />
                <Text size="2" color="blue">• Pure Radix UI Themes for design</Text><br />
                <Text size="2" color="blue">• Responsive design and accessibility</Text><br />
                <Text size="2" color="blue">• Modern React patterns and hooks</Text>
              </Box>
            </Box>
          </Flex>
        </Card>
      </Container>
    </AppShell>
  );
}
