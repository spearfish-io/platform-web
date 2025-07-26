"use client";

import * as React from "react";
import { 
  Card, 
  Flex, 
  Text, 
  Badge,
  Button,
  Switch,
  Box,
  Grid,
  TextField
} from "@radix-ui/themes";

// Example state management pattern
export function StateManagementExample() {
  const [count, setCount] = React.useState(0);
  const [enabled, setEnabled] = React.useState(false);

  return (
    <Card size="2">
      <Flex direction="column" gap="3">
        <Flex align="center" justify="between">
          <Text size="2" weight="medium">State Example</Text>
          <Badge variant="soft" size="1">Interactive</Badge>
        </Flex>
        
        <Flex align="center" gap="3">
          <Button onClick={() => setCount(c => c + 1)}>
            Count: {count}
          </Button>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
          <Text size="2" color="gray">
            {enabled ? "Enabled" : "Disabled"}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

// Interactive components for accessibility testing
export function AccessibleForm() {
  const [email, setEmail] = React.useState("");
  const [notifications, setNotifications] = React.useState(false);

  return (
    <Box style={{ maxWidth: "300px" }}>
      <Flex direction="column" gap="3">
        <Box>
          <Text as="label" size="2" weight="medium" htmlFor="email-input">
            Email Address
          </Text>
          <TextField
            id="email-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="email-help"
          />
          <Text id="email-help" size="1" color="gray">
            We'll never share your email address
          </Text>
        </Box>
        
        <Flex align="center" gap="2">
          <Switch
            id="notifications-switch"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <Text as="label" htmlFor="notifications-switch" size="2">
            Enable notifications
          </Text>
        </Flex>
        
        <Button type="submit" disabled={!email}>
          Subscribe
        </Button>
      </Flex>
    </Box>
  );
}

export function ColorContrastDemo() {
  return (
    <Grid columns={{ initial: "1", sm: "2" }} gap="3" style={{ maxWidth: "400px" }}>
      <Card size="2" style={{ background: "var(--green-2)", border: "1px solid var(--green-6)" }}>
        <Text color="green" weight="bold">✅ Good Contrast</Text>
        <Text color="green" size="2">AAA compliant text color</Text>
      </Card>
      
      <Card size="2" style={{ background: "var(--blue-2)", border: "1px solid var(--blue-6)" }}>
        <Text color="blue" weight="bold">✅ Good Contrast</Text>
        <Text color="blue" size="2">AA compliant text color</Text>
      </Card>
    </Grid>
  );
}

export function KeyboardNavigationDemo() {
  return (
    <Flex gap="3" wrap="wrap">
      <Button tabIndex={0}>Button 1</Button>
      <Button tabIndex={0}>Button 2</Button>
      <Button tabIndex={0}>Button 3</Button>
      <Text size="2" color="gray">
        Try using Tab, Enter, and Space keys
      </Text>
    </Flex>
  );
}