"use client";

import * as React from "react";
import { 
  Box, 
  Card, 
  Flex, 
  Text, 
  Button,
  Code,
  Badge
} from "@radix-ui/themes";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";

interface CodeExampleProps {
  title?: string;
  description?: string;
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  maxHeight?: string;
  size?: "1" | "2" | "3" | "4";
}

export function CodeExample({
  title,
  description,
  code,
  language = "tsx",
  filename,
  highlightLines = [],
  maxHeight = "400px",
  size = "2"
}: CodeExampleProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = code.split('\n');

  return (
    <Card size={size}>
      <Flex direction="column" gap="3">
        {/* Header */}
        {(title || filename) && (
          <Flex align="center" justify="between">
            <Box>
              {title && (
                <Text size="3" weight="medium" mb="1">
                  {title}
                </Text>
              )}
              {filename && (
                <Flex align="center" gap="2">
                  <Badge variant="soft" size="1">
                    {filename}
                  </Badge>
                  {language && (
                    <Badge variant="outline" size="1" color="gray">
                      {language}
                    </Badge>
                  )}
                </Flex>
              )}
            </Box>
            
            <Button
              variant="soft"
              size="1"
              onClick={handleCopy}
              color={copied ? "green" : "gray"}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </Flex>
        )}

        {/* Description */}
        {description && (
          <Text size="2" color="gray">
            {description}
          </Text>
        )}

        {/* Code block */}
        <Box
          style={{
            background: "var(--gray-1)",
            border: "1px solid var(--gray-6)",
            borderRadius: "var(--radius-3)",
            maxHeight,
            overflow: "auto"
          }}
        >
          <Code 
            size={size}
            style={{
              display: "block",
              padding: "16px",
              whiteSpace: "pre",
              fontFamily: "var(--font-mono, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace)",
              lineHeight: "1.5"
            }}
          >
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);
              
              return (
                <Box
                  key={index}
                  style={{
                    display: "block",
                    backgroundColor: isHighlighted ? "var(--yellow-3)" : "transparent",
                    margin: "0 -16px",
                    padding: "0 16px",
                    borderLeft: isHighlighted ? "3px solid var(--yellow-9)" : "3px solid transparent"
                  }}
                >
                  {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                </Box>
              );
            })}
          </Code>
        </Box>
      </Flex>
    </Card>
  );
}

interface InlineCodeProps {
  children: React.ReactNode;
  color?: "gray" | "blue" | "green" | "red" | "orange" | "purple";
}

export function InlineCode({ children, color = "gray" }: InlineCodeProps) {
  return (
    <Code size="2" color={color}>
      {children}
    </Code>
  );
}

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ children, language = "tsx", title }: CodeBlockProps) {
  return (
    <CodeExample
      code={children}
      language={language}
      title={title}
      size="2"
    />
  );
}