"use client";

import * as React from "react";
import { 
  Box, 
  Card, 
  Flex, 
  Text, 
  Heading,
  Badge,
  Button,
  Separator
} from "@radix-ui/themes";
import { 
  CheckCircledIcon, 
  CrossCircledIcon, 
  QuestionMarkCircledIcon,
  EyeOpenIcon,
  KeyboardIcon,
  SpeakerLoudIcon
} from "@radix-ui/react-icons";

interface AccessibilityTestProps {
  title: string;
  description: string;
  children: React.ReactNode;
  tests: AccessibilityCheckResult[];
  category: "keyboard" | "screen-reader" | "color-contrast" | "focus" | "semantic";
}

export interface AccessibilityCheckResult {
  name: string;
  status: "pass" | "fail" | "warning" | "manual";
  description: string;
  impact?: "critical" | "serious" | "moderate" | "minor";
  helpUrl?: string;
}

export function AccessibilityTest({
  title,
  description,
  children,
  tests,
  category
}: AccessibilityTestProps) {
  const [showResults, setShowResults] = React.useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircledIcon style={{ color: "var(--green-9)" }} />;
      case "fail":
        return <CrossCircledIcon style={{ color: "var(--red-9)" }} />;
      case "warning":
        return <QuestionMarkCircledIcon style={{ color: "var(--orange-9)" }} />;
      case "manual":
        return <EyeOpenIcon style={{ color: "var(--blue-9)" }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "green";
      case "fail":
        return "red";
      case "warning":
        return "orange";
      case "manual":
        return "blue";
      default:
        return "gray";
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case "keyboard":
        return <KeyboardIcon />;
      case "screen-reader":
        return <SpeakerLoudIcon />;
      case "color-contrast":
      case "focus":
      case "semantic":
        return <EyeOpenIcon />;
      default:
        return <EyeOpenIcon />;
    }
  };

  const passCount = tests.filter(test => test.status === "pass").length;
  const failCount = tests.filter(test => test.status === "fail").length;
  const warningCount = tests.filter(test => test.status === "warning").length;
  const manualCount = tests.filter(test => test.status === "manual").length;

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        {/* Header */}
        <Flex align="center" justify="between">
          <Flex align="center" gap="3">
            <Box style={{ color: "var(--blue-9)" }}>
              {getCategoryIcon()}
            </Box>
            <Box>
              <Heading size="4" mb="1">
                {title}
              </Heading>
              <Text size="2" color="gray">
                {description}
              </Text>
            </Box>
          </Flex>

          <Flex align="center" gap="2">
            <Badge variant="soft" color="gray" size="1">
              {category.replace('-', ' ')}
            </Badge>
            <Button
              variant="soft"
              size="1"
              onClick={() => setShowResults(!showResults)}
            >
              {showResults ? "Hide" : "Show"} Results
            </Button>
          </Flex>
        </Flex>

        {/* Component demo */}
        <Box 
          p="4" 
          style={{ 
            background: "var(--gray-2)", 
            borderRadius: "var(--radius-3)",
            border: "1px solid var(--gray-6)"
          }}
        >
          {children}
        </Box>

        {/* Test summary */}
        <Flex align="center" gap="4" wrap="wrap">
          {passCount > 0 && (
            <Flex align="center" gap="1">
              <CheckCircledIcon style={{ color: "var(--green-9)" }} />
              <Text size="2" color="green">
                {passCount} passed
              </Text>
            </Flex>
          )}
          
          {failCount > 0 && (
            <Flex align="center" gap="1">
              <CrossCircledIcon style={{ color: "var(--red-9)" }} />
              <Text size="2" color="red">
                {failCount} failed
              </Text>
            </Flex>
          )}
          
          {warningCount > 0 && (
            <Flex align="center" gap="1">
              <QuestionMarkCircledIcon style={{ color: "var(--orange-9)" }} />
              <Text size="2" color="orange">
                {warningCount} warnings
              </Text>
            </Flex>
          )}
          
          {manualCount > 0 && (
            <Flex align="center" gap="1">
              <EyeOpenIcon style={{ color: "var(--blue-9)" }} />
              <Text size="2" color="blue">
                {manualCount} manual checks
              </Text>
            </Flex>
          )}
        </Flex>

        {/* Detailed results */}
        {showResults && (
          <Box>
            <Separator size="4" mb="3" />
            <Heading size="3" mb="3">Test Results</Heading>
            
            <Flex direction="column" gap="2">
              {tests.map((test, index) => (
                <Card key={index} size="1" variant="surface">
                  <Flex align="center" gap="3">
                    {getStatusIcon(test.status)}
                    
                    <Box style={{ flex: 1 }}>
                      <Flex align="center" justify="between" mb="1">
                        <Text size="2" weight="medium">
                          {test.name}
                        </Text>
                        <Badge 
                          variant="soft" 
                          color={getStatusColor(test.status)}
                          size="1"
                        >
                          {test.status}
                        </Badge>
                      </Flex>
                      
                      <Text size="1" color="gray">
                        {test.description}
                      </Text>
                      
                      {test.impact && (
                        <Badge 
                          variant="outline" 
                          color={test.impact === "critical" ? "red" : 
                                 test.impact === "serious" ? "orange" :
                                 test.impact === "moderate" ? "yellow" : "gray"}
                          size="1"
                          style={{ marginTop: "4px" }}
                        >
                          {test.impact} impact
                        </Badge>
                      )}
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Box>
        )}
      </Flex>
    </Card>
  );
}

interface WCAGChecklistProps {
  level: "A" | "AA" | "AAA";
  checks: Array<{
    criterion: string;
    description: string;
    status: "pass" | "fail" | "not-applicable";
    techniques?: string[];
  }>;
}

export function WCAGChecklist({ level, checks }: WCAGChecklistProps) {
  const passCount = checks.filter(check => check.status === "pass").length;
  const failCount = checks.filter(check => check.status === "fail").length;
  const naCount = checks.filter(check => check.status === "not-applicable").length;

  return (
    <Card size="3">
      <Flex direction="column" gap="3">
        <Flex align="center" justify="between">
          <Heading size="4">
            WCAG {level} Compliance
          </Heading>
          <Badge 
            variant="soft" 
            color={failCount === 0 ? "green" : "orange"}
            size="2"
          >
            {passCount}/{checks.length - naCount} passing
          </Badge>
        </Flex>
        
        <Flex direction="column" gap="2">
          {checks.map((check, index) => (
            <Flex key={index} align="center" gap="3" p="2">
              {check.status === "pass" && <CheckCircledIcon style={{ color: "var(--green-9)" }} />}
              {check.status === "fail" && <CrossCircledIcon style={{ color: "var(--red-9)" }} />}
              {check.status === "not-applicable" && <Text size="2" color="gray">N/A</Text>}
              
              <Box style={{ flex: 1 }}>
                <Text size="2" weight="medium" mb="1">
                  {check.criterion}
                </Text>
                <Text size="1" color="gray">
                  {check.description}
                </Text>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}