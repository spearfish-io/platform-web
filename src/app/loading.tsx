import { Box, Flex, Text } from "@radix-ui/themes";

export default function Loading() {
  return (
    <Flex 
      align="center" 
      justify="center" 
      style={{ 
        minHeight: "50vh",
        width: "100%" 
      }}
    >
      <Flex direction="column" align="center" gap="4">
        <Box
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid var(--gray-6)",
            borderTop: "3px solid var(--blue-9)",
            borderRadius: "50%",
            animation: "rotation 1s linear infinite"
          }}
        />
        <Text size="3" color="gray">
          Loading...
        </Text>
      </Flex>
    </Flex>
  );
}