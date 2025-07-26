import * as React from "react";
import { 
  Box, 
  Card, 
  Flex, 
  Text, 
  Heading,
  Badge,
  Progress
} from "@radix-ui/themes";
import { 
  StopwatchIcon, 
  ActivityLogIcon, 
  BarChartIcon,
  CheckCircledIcon,
  CrossCircledIcon
} from "@radix-ui/react-icons";

interface PerformanceMetricProps {
  name: string;
  value: number;
  unit: string;
  target?: number;
  description?: string;
  type: "timing" | "size" | "score" | "count";
  status?: "good" | "needs-improvement" | "poor";
}

export function PerformanceMetric({
  name,
  value,
  unit,
  target,
  description,
  type,
  status
}: PerformanceMetricProps) {
  const getIcon = () => {
    switch (type) {
      case "timing":
        return <StopwatchIcon />;
      case "size":
        return <BarChartIcon />;
      case "score":
        return <ActivityLogIcon />;
      case "count":
        return <ActivityLogIcon />;
      default:
        return <ActivityLogIcon />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "good":
        return "green";
      case "needs-improvement":
        return "orange";
      case "poor":
        return "red";
      default:
        return "blue";
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "good":
        return <CheckCircledIcon />;
      case "poor":
        return <CrossCircledIcon />;
      default:
        return null;
    }
  };

  const formatValue = (val: number) => {
    if (type === "size" && val > 1024) {
      if (val > 1024 * 1024) {
        return `${(val / (1024 * 1024)).toFixed(1)}MB`;
      }
      return `${(val / 1024).toFixed(1)}KB`;
    }
    if (type === "timing" && val < 1) {
      return `${(val * 1000).toFixed(0)}ms`;
    }
    return val.toLocaleString();
  };

  const progress = target ? Math.min((value / target) * 100, 100) : undefined;

  return (
    <Card size="2">
      <Flex direction="column" gap="3">
        <Flex align="center" justify="between">
          <Flex align="center" gap="2">
            <Box style={{ color: `var(--${getStatusColor(status)}-9)` }}>
              {getIcon()}
            </Box>
            <Text size="2" weight="medium">
              {name}
            </Text>
          </Flex>
          
          {status && (
            <Flex align="center" gap="1">
              {getStatusIcon(status) && (
                <Box style={{ color: `var(--${getStatusColor(status)}-9)` }}>
                  {getStatusIcon(status)}
                </Box>
              )}
              <Badge 
                variant="soft" 
                color={getStatusColor(status)}
                size="1"
              >
                {status.replace('-', ' ')}
              </Badge>
            </Flex>
          )}
        </Flex>

        <Box>
          <Flex align="baseline" gap="1" mb="1">
            <Heading size="4">
              {formatValue(value)}
            </Heading>
            <Text size="2" color="gray">
              {unit}
            </Text>
          </Flex>
          
          {target && (
            <Flex direction="column" gap="2">
              <Text size="1" color="gray">
                Target: {formatValue(target)} {unit}
              </Text>
              {progress !== undefined && (
                <Progress 
                  value={progress} 
                  color={getStatusColor(status)}
                  size="1"
                />
              )}
            </Flex>
          )}
        </Box>

        {description && (
          <Text size="1" color="gray">
            {description}
          </Text>
        )}
      </Flex>
    </Card>
  );
}

interface CoreWebVitalsProps {
  lcp?: number; // Largest Contentful Paint (seconds)
  fid?: number; // First Input Delay (milliseconds) 
  cls?: number; // Cumulative Layout Shift (score)
  fcp?: number; // First Contentful Paint (seconds)
  ttfb?: number; // Time to First Byte (milliseconds)
}

export function CoreWebVitals({ lcp, fid, cls, fcp, ttfb }: CoreWebVitalsProps) {
  const getVitalStatus = (metric: string, value?: number): "good" | "needs-improvement" | "poor" | undefined => {
    if (value === undefined) return undefined;
    
    switch (metric) {
      case "lcp":
        return value <= 2.5 ? "good" : value <= 4.0 ? "needs-improvement" : "poor";
      case "fid": 
        return value <= 100 ? "good" : value <= 300 ? "needs-improvement" : "poor";
      case "cls":
        return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
      case "fcp":
        return value <= 1.8 ? "good" : value <= 3.0 ? "needs-improvement" : "poor";
      case "ttfb":
        return value <= 800 ? "good" : value <= 1800 ? "needs-improvement" : "poor";
      default:
        return undefined;
    }
  };

  return (
    <Flex direction="column" gap="3">
      <Heading size="4" mb="2">Core Web Vitals</Heading>
      
      <Flex wrap="wrap" gap="3">
        {lcp !== undefined && (
          <PerformanceMetric
            name="LCP"
            value={lcp}
            unit="s"
            target={2.5}
            type="timing"
            status={getVitalStatus("lcp", lcp)}
            description="Largest Contentful Paint"
          />
        )}
        
        {fid !== undefined && (
          <PerformanceMetric
            name="FID"
            value={fid}
            unit="ms"
            target={100}
            type="timing"
            status={getVitalStatus("fid", fid)}
            description="First Input Delay"
          />
        )}
        
        {cls !== undefined && (
          <PerformanceMetric
            name="CLS"
            value={cls}
            unit=""
            target={0.1}
            type="score"
            status={getVitalStatus("cls", cls)}
            description="Cumulative Layout Shift"
          />
        )}
        
        {fcp !== undefined && (
          <PerformanceMetric
            name="FCP"
            value={fcp}
            unit="s"
            target={1.8}
            type="timing"
            status={getVitalStatus("fcp", fcp)}
            description="First Contentful Paint"
          />
        )}
        
        {ttfb !== undefined && (
          <PerformanceMetric
            name="TTFB"
            value={ttfb}
            unit="ms"
            target={800}
            type="timing"
            status={getVitalStatus("ttfb", ttfb)}
            description="Time to First Byte"
          />
        )}
      </Flex>
    </Flex>
  );
}