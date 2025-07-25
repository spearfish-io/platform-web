"use client";

import { Box, Flex, Text, Heading, Button } from "@radix-ui/themes";
import { ExclamationTriangleIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Flex 
      align="center" 
      justify="center" 
      style={{ 
        minHeight: "50vh",
        width: "100%" 
      }}
    >
      <Flex direction="column" align="center" gap="4" p="6">
        <Box style={{ color: "var(--red-9)" }}>
          <ExclamationTriangleIcon style={{ width: "48px", height: "48px" }} />
        </Box>
        
        <Flex direction="column" align="center" gap="2">
          <Heading size="5" color="red">
            Something went wrong!
          </Heading>
          <Text size="3" color="gray" style={{ textAlign: "center", maxWidth: "400px" }}>
            An error occurred while loading this page. Please try again or contact support if the problem persists.
          </Text>
        </Flex>
        
        <Button
          onClick={reset}
          variant="soft"
          color="red"
          size="3"
        >
          <ReloadIcon style={{ width: "16px", height: "16px" }} />
          Try again
        </Button>
        
        {process.env.NODE_ENV === "development" && (
          <Box 
            p="3" 
            style={{ 
              background: "var(--gray-2)", 
              border: "1px solid var(--gray-6)",
              borderRadius: "6px",
              maxWidth: "600px",
              overflow: "auto"
            }}
          >
            <Text size="1" style={{ fontFamily: "monospace", color: "var(--red-11)" }}>
              {error.message}
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}