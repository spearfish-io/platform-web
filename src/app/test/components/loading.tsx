import { Container, Box, Card, Flex } from "@radix-ui/themes";
import { AppShell } from "@/components/layout/app-shell";

export default function ComponentsLoading() {
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
              width: "70%",
              marginBottom: "var(--space-4)"
            }} 
          />
          <Flex gap="2">
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                style={{
                  height: "24px",
                  width: "100px",
                  background: "var(--gray-2)",
                  borderRadius: "var(--radius-2)"
                }}
              />
            ))}
          </Flex>
        </Box>

        {/* Ladle integration skeleton */}
        <Card size="3" mb="8">
          <Flex gap="4">
            <Box 
              style={{ 
                width: "24px", 
                height: "24px", 
                background: "var(--gray-3)", 
                borderRadius: "var(--radius-2)"
              }} 
            />
            <Box style={{ flex: 1 }}>
              <Box 
                style={{ 
                  height: "24px", 
                  background: "var(--gray-3)", 
                  borderRadius: "var(--radius-2)",
                  marginBottom: "var(--space-2)"
                }} 
              />
              <Box 
                style={{ 
                  height: "16px", 
                  background: "var(--gray-2)", 
                  borderRadius: "var(--radius-2)",
                  width: "80%",
                  marginBottom: "var(--space-3)"
                }} 
              />
              <Box 
                style={{ 
                  height: "32px", 
                  width: "120px",
                  background: "var(--gray-3)", 
                  borderRadius: "var(--radius-2)"
                }} 
              />
            </Box>
          </Flex>
        </Card>

        {/* Component showcases skeleton */}
        <Flex direction="column" gap="6">
          {[1, 2, 3].map((section) => (
            <Card key={section} size="3">
              <Box mb="4">
                <Box 
                  style={{ 
                    height: "32px", 
                    background: "var(--gray-3)", 
                    borderRadius: "var(--radius-2)",
                    width: "150px",
                    marginBottom: "var(--space-2)"
                  }} 
                />
                <Box 
                  style={{ 
                    height: "16px", 
                    background: "var(--gray-2)", 
                    borderRadius: "var(--radius-2)",
                    width: "60%"
                  }} 
                />
              </Box>
              
              <Box 
                p="4" 
                style={{ 
                  background: "var(--gray-2)", 
                  borderRadius: "var(--radius-3)",
                  marginBottom: "var(--space-4)"
                }}
              >
                <Flex justify="center">
                  <Box 
                    style={{ 
                      height: "40px", 
                      width: "120px",
                      background: "var(--gray-4)", 
                      borderRadius: "var(--radius-2)"
                    }} 
                  />
                </Flex>
              </Box>
              
              <Flex direction="column" gap="3">
                {[1, 2].map((variant) => (
                  <Box key={variant}>
                    <Box 
                      style={{ 
                        height: "16px", 
                        background: "var(--gray-2)", 
                        borderRadius: "var(--radius-2)",
                        width: "80px",
                        marginBottom: "var(--space-2)"
                      }} 
                    />
                    <Box 
                      p="3" 
                      style={{ 
                        background: "var(--gray-1)", 
                        borderRadius: "var(--radius-2)"
                      }}
                    >
                      <Flex gap="3">
                        {[1, 2, 3].map((item) => (
                          <Box
                            key={item}
                            style={{
                              height: "32px",
                              width: "80px",
                              background: "var(--gray-3)",
                              borderRadius: "var(--radius-2)"
                            }}
                          />
                        ))}
                      </Flex>
                    </Box>
                  </Box>
                ))}
              </Flex>
            </Card>
          ))}
        </Flex>
      </Container>
    </AppShell>
  );
}