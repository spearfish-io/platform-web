import * as React from "react";
import { Box, Card, Flex, Text, Heading, Code } from "@radix-ui/themes";

interface DesignTokenProps {
  name: string;
  value: string;
  description?: string;
  category: "color" | "space" | "radius" | "typography" | "shadow";
  preview?: React.ReactNode;
}

export function DesignToken({ 
  name, 
  value, 
  description, 
  category, 
  preview 
}: DesignTokenProps) {
  return (
    <Card size="2" style={{ minHeight: "120px" }}>
      <Flex direction="column" gap="2" height="100%">
        <Flex align="center" justify="between">
          <Text size="1" weight="medium" color="gray">
            {category.toUpperCase()}
          </Text>
          {preview && (
            <Box style={{ width: "24px", height: "24px" }}>
              {preview}
            </Box>
          )}
        </Flex>
        
        <Box>
          <Heading size="3" mb="1">
            {name}
          </Heading>
          <Code size="1" color="gray">
            {value}
          </Code>
        </Box>
        
        {description && (
          <Text size="1" color="gray" style={{ marginTop: "auto" }}>
            {description}
          </Text>
        )}
      </Flex>
    </Card>
  );
}

interface ColorTokenProps {
  name: string;
  cssVar: string;
  scale?: number;
}

export function ColorToken({ name, cssVar, scale }: ColorTokenProps) {
  const colorValue = `var(${cssVar})`;
  
  return (
    <DesignToken
      name={name}
      value={cssVar}
      category="color"
      description={scale ? `Step ${scale} of color scale` : undefined}
      preview={
        <Box
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: colorValue,
            borderRadius: "4px",
            border: "1px solid var(--gray-6)"
          }}
        />
      }
    />
  );
}

interface SpaceTokenProps {
  name: string;
  cssVar: string;
  pixelValue: string;
}

export function SpaceToken({ name, cssVar, pixelValue }: SpaceTokenProps) {
  return (
    <DesignToken
      name={name}
      value={`${cssVar} (${pixelValue})`}
      category="space"
      preview={
        <Box
          style={{
            width: `var(${cssVar})`,
            height: "8px",
            backgroundColor: "var(--blue-9)",
            borderRadius: "2px"
          }}
        />
      }
    />
  );
}

interface TypographyTokenProps {
  name: string;
  size: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
}

export function TypographyToken({ name, size }: TypographyTokenProps) {
  return (
    <Card size="2">
      <Flex direction="column" gap="2">
        <Text size="1" weight="medium" color="gray">
          TYPOGRAPHY
        </Text>
        <Heading size={size}>
          {name}
        </Heading>
        <Code size="1" color="gray">
          size="{size}"
        </Code>
      </Flex>
    </Card>
  );
}