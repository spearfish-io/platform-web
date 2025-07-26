import { Container, Box, Card, Flex } from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";

export default function DesignSystemLoading() {
  return (
    <AppShell>
      <Container size="4" p="6">
        {/* Header skeleton */}
        <Box mb="8">
          <Box 
            style={{ 
              height: "48px", 
              background: "var(--gray-3)", 
              borderRadius: "var(--radius-2)",
              marginBottom: "var(--space-3)"
            }} 
          />
          <Box 
            style={{ 
              height: "24px", 
              background: "var(--gray-2)", 
              borderRadius: "var(--radius-2)",
              width: "60%",
              marginBottom: "var(--space-4)"
            }} 
          />
          <Flex gap="2">
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                style={{
                  height: "24px",
                  width: "80px",
                  background: "var(--gray-2)",
                  borderRadius: "var(--radius-2)"
                }}
              />
            ))}
          </Flex>
        </Box>

        {/* Content skeleton */}
        <Flex direction="column" gap="6">
          {[1, 2, 3, 4].map((section) => (
            <Box key={section}>
              <Box 
                style={{ 
                  height: "32px", 
                  background: "var(--gray-3)", 
                  borderRadius: "var(--radius-2)",
                  width: "200px",
                  marginBottom: "var(--space-4)"
                }} 
              />
              <Flex gap="3" wrap="wrap">
                {[1, 2, 3, 4, 5, 6].map((card) => (
                  <Card key={card} size="2" style={{ minWidth: "150px", flex: "1" }}>
                    <Box 
                      style={{ 
                        height: "80px", 
                        background: "var(--gray-2)", 
                        borderRadius: "var(--radius-2)"
                      }} 
                    />
                  </Card>
                ))}
              </Flex>
            </Box>
          ))}
        </Flex>
      </Container>
    </AppShell>
  );
}