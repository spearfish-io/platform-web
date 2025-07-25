import { Container, Flex, Text, Box } from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";

export default function AnalyticsLoading() {
  return (
    <AppShell>
      <Container size="4" p="6">
        <Flex 
          align="center" 
          justify="center" 
          style={{ minHeight: "50vh" }}
        >
          <Flex direction="column" align="center" gap="4">
            <Box
              style={{
                width: "32px",
                height: "32px",
                border: "2px solid var(--gray-6)",
                borderTop: "2px solid var(--blue-9)",
                borderRadius: "50%",
                animation: "rotation 1s linear infinite"
              }}
            />
            <Text size="3" color="gray">
              Loading analytics...
            </Text>
          </Flex>
        </Flex>
      </Container>
    </AppShell>
  );
}