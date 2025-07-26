import * as React from "react";
import { Box, Flex, Text, Heading, Button, Card, Container } from "@radix-ui/themes";
import { MagnifyingGlassIcon, HomeIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { getTestPagesConfig, getTestPageBlockedMessage } from "@/lib/test-pages-config";

export default function NotFound() {
  const config = getTestPagesConfig();
  
  // Check if this might be a blocked test page based on common paths
  const isLikelyBlockedTestPage = typeof window !== 'undefined' && [
    '/design-system', '/components', '/patterns', '/performance', '/accessibility', '/auth-demo'
  ].some(path => window.location.pathname.startsWith(path));

  return (
    <AppShell>
      <Container size="3" p="6">
        <Flex 
          align="center" 
          justify="center" 
          style={{ minHeight: "60vh" }}
        >
          <Flex direction="column" align="center" gap="6" style={{ maxWidth: "600px" }}>
            <Box style={{ color: isLikelyBlockedTestPage && !config.allowAccess ? "var(--orange-9)" : "var(--gray-9)" }}>
              {isLikelyBlockedTestPage && !config.allowAccess ? (
                <ExclamationTriangleIcon style={{ width: "64px", height: "64px" }} />
              ) : (
                <MagnifyingGlassIcon style={{ width: "64px", height: "64px" }} />
              )}
            </Box>
            
            <Flex direction="column" align="center" gap="3">
              <Heading size="8" style={{ color: "var(--gray-11)" }}>
                {isLikelyBlockedTestPage && !config.allowAccess ? "Access Restricted" : "404"}
              </Heading>
              <Heading size="5" color="gray">
                {isLikelyBlockedTestPage && !config.allowAccess ? "Design System Pages Unavailable" : "Page Not Found"}
              </Heading>
              <Text size="3" color="gray" style={{ textAlign: "center" }}>
                {isLikelyBlockedTestPage && !config.allowAccess
                  ? getTestPageBlockedMessage(config.environment)
                  : "The page you're looking for doesn't exist or has been moved to a different location."
                }
              </Text>
            </Flex>

            {isLikelyBlockedTestPage && !config.allowAccess && (
              <Card size="3" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
                <Flex direction="column" gap="3">
                  <Heading size="4" color="blue">
                    About Design System Pages
                  </Heading>
                  <Text size="2" color="blue">
                    The design system test pages contain development tools, component documentation, 
                    and technical demonstrations that are only intended for local development environments.
                  </Text>
                  <Text size="2" color="blue">
                    <strong>Current environment:</strong> {config.environment}
                  </Text>
                </Flex>
              </Card>
            )}
            
            <Flex gap="3" wrap="wrap" justify="center">
              <Box asChild>
                <Link href="/">
                  <Button variant="solid" size="3">
                    <HomeIcon style={{ width: "16px", height: "16px" }} />
                    Go to Dashboard
                  </Button>
                </Link>
              </Box>
              
              {config.allowAccess && (
                <>
                  <Box asChild>
                    <Link href="/design-system">
                      <Button variant="soft" size="3">
                        Design System
                      </Button>
                    </Link>
                  </Box>
                  <Box asChild>
                    <Link href="/components">
                      <Button variant="soft" size="3">
                        Components
                      </Button>
                    </Link>
                  </Box>
                </>
              )}
            </Flex>

            {process.env.NODE_ENV === 'development' && (
              <Card size="2" style={{ background: "var(--gray-2)" }}>
                <Text size="1" color="gray" style={{ fontFamily: "monospace" }}>
                  Debug Info (dev only):<br />
                  Environment: {config.environment}<br />
                  Test pages enabled: {config.enabled ? 'Yes' : 'No'}<br />
                  Likely blocked test page: {isLikelyBlockedTestPage ? 'Yes' : 'No'}
                </Text>
              </Card>
            )}
          </Flex>
        </Flex>
      </Container>
    </AppShell>
  );
}