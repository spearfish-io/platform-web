import { Box, Flex, Text, Heading, Button } from "@radix-ui/themes";
import { MagnifyingGlassIcon, HomeIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <Flex 
      align="center" 
      justify="center" 
      style={{ 
        minHeight: "100vh",
        width: "100%" 
      }}
    >
      <Flex direction="column" align="center" gap="4" p="6">
        <Box style={{ color: "var(--gray-9)" }}>
          <MagnifyingGlassIcon style={{ width: "64px", height: "64px" }} />
        </Box>
        
        <Flex direction="column" align="center" gap="2">
          <Heading size="8" style={{ color: "var(--gray-11)" }}>
            404
          </Heading>
          <Heading size="5" color="gray">
            Page Not Found
          </Heading>
          <Text size="3" color="gray" style={{ textAlign: "center", maxWidth: "400px" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a different location.
          </Text>
        </Flex>
        
        <Box asChild>
          <Link href="/">
            <Button variant="solid" size="3">
              <HomeIcon style={{ width: "16px", height: "16px" }} />
              Go Home
            </Button>
          </Link>
        </Box>
      </Flex>
    </Flex>
  );
}