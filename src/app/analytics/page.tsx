import { Container, Heading, Text, Card, Grid, Flex, Box } from "@radix-ui/themes";
import { BarChartIcon } from "@radix-ui/react-icons";
import { AppShell } from "@/components/layout/app-shell";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <Container size="4" p="6">
        <Box mb="6">
          <Heading size="8" mb="2">
            Analytics
          </Heading>
          <Text size="4" color="gray">
            View your application analytics and performance metrics
          </Text>
        </Box>

        <Grid columns={{ initial: "1", md: "2" }} gap="4">
          <Card size="3">
            <Flex align="center" gap="3" mb="3">
              <Box style={{ color: "var(--blue-9)" }}>
                <BarChartIcon style={{ width: "20px", height: "20px" }} />
              </Box>
              <Heading size="4">Page Views</Heading>
            </Flex>
            <Text size="6" weight="bold" mb="2">15,423</Text>
            <Text size="2" color="gray">This month</Text>
          </Card>

          <Card size="3">
            <Flex align="center" gap="3" mb="3">
              <Box style={{ color: "var(--green-9)" }}>
                <BarChartIcon style={{ width: "20px", height: "20px" }} />
              </Box>
              <Heading size="4">Unique Visitors</Heading>
            </Flex>
            <Text size="6" weight="bold" mb="2">8,291</Text>
            <Text size="2" color="gray">This month</Text>
          </Card>
        </Grid>
      </Container>
    </AppShell>
  );
}