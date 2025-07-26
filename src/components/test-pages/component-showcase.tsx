"use client";

import * as React from "react";
import { 
  Box, 
  Card, 
  Flex, 
  Text, 
  Heading, 
  Button,
  Separator,
  Code
} from "@radix-ui/themes";
import { CodeIcon, CopyIcon } from "@radix-ui/react-icons";

interface ComponentShowcaseProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  props?: Record<string, any>;
  variants?: Array<{
    name: string;
    component: React.ReactNode;
    props?: Record<string, any>;
  }>;
}

export function ComponentShowcase({
  title,
  description,
  children,
  code,
  props,
  variants
}: ComponentShowcaseProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const handleCopyCode = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" justify="between">
          <Box>
            <Heading size="5" mb="1">
              {title}
            </Heading>
            {description && (
              <Text size="2" color="gray">
                {description}
              </Text>
            )}
          </Box>
          
          {code && (
            <Flex gap="2">
              <Button
                variant="soft"
                size="1"
                onClick={() => setShowCode(!showCode)}
              >
                <CodeIcon />
                {showCode ? "Hide" : "Show"} Code
              </Button>
              {showCode && (
                <Button
                  variant="soft"
                  size="1"
                  onClick={handleCopyCode}
                  color={copiedCode ? "green" : "gray"}
                >
                  <CopyIcon />
                  {copiedCode ? "Copied!" : "Copy"}
                </Button>
              )}
            </Flex>
          )}
        </Flex>

        {/* Main component display */}
        <Box 
          p="4" 
          style={{ 
            background: "var(--gray-2)", 
            borderRadius: "var(--radius-3)",
            border: "1px solid var(--gray-6)"
          }}
        >
          <Flex align="center" justify="center" wrap="wrap" gap="4">
            {children}
          </Flex>
        </Box>

        {/* Props display */}
        {props && (
          <Box>
            <Text size="2" weight="medium" mb="2">Current Props:</Text>
            <Code size="1" style={{ display: "block", padding: "8px" }}>
              {JSON.stringify(props, null, 2)}
            </Code>
          </Box>
        )}

        {/* Variants */}
        {variants && variants.length > 0 && (
          <Box>
            <Text size="2" weight="medium" mb="3">Variants:</Text>
            <Flex direction="column" gap="3">
              {variants.map((variant, index) => (
                <Box key={index}>
                  <Text size="1" weight="medium" color="gray" mb="2">
                    {variant.name}
                  </Text>
                  <Box 
                    p="3" 
                    style={{ 
                      background: "var(--gray-1)", 
                      borderRadius: "var(--radius-2)",
                      border: "1px solid var(--gray-5)"
                    }}
                  >
                    <Flex align="center" justify="center">
                      {variant.component}
                    </Flex>
                  </Box>
                  {variant.props && (
                    <Code size="1" mt="2" style={{ display: "block" }}>
                      {JSON.stringify(variant.props, null, 2)}
                    </Code>
                  )}
                </Box>
              ))}
            </Flex>
          </Box>
        )}

        {/* Code display */}
        {showCode && code && (
          <Box>
            <Separator size="4" mb="3" />
            <Text size="2" weight="medium" mb="2">Code:</Text>
            <Code 
              size="1" 
              style={{ 
                display: "block", 
                padding: "12px",
                background: "var(--gray-1)",
                border: "1px solid var(--gray-6)",
                borderRadius: "var(--radius-2)",
                whiteSpace: "pre-wrap",
                maxHeight: "300px",
                overflow: "auto"
              }}
            >
              {code}
            </Code>
          </Box>
        )}
      </Flex>
    </Card>
  );
}