import { Container, Heading, Text, Card, Flex, Box, Button } from "@radix-ui/themes";
import { GearIcon, PersonIcon } from "@radix-ui/react-icons";
import { AppShell } from "@/components/layout/app-shell";

export default function SettingsPage() {
  return (
    <AppShell>
      <Container size="4" p="6">
        <Box mb="6">
          <Heading size="8" mb="2">
            Settings
          </Heading>
          <Text size="4" color="gray">
            Manage your application preferences and configuration
          </Text>
        </Box>

        <Box style={{ maxWidth: "600px" }}>
          <Card size="3" mb="4">
            <Flex align="center" gap="3" mb="4">
              <Box style={{ color: "var(--blue-9)" }}>
                <PersonIcon style={{ width: "20px", height: "20px" }} />
              </Box>
              <Box>
                <Heading size="4" mb="1">Profile Settings</Heading>
                <Text size="2" color="gray">Manage your personal information</Text>
              </Box>
            </Flex>
            <Button variant="soft" size="2">
              Edit Profile
            </Button>
          </Card>

          <Card size="3" mb="4">
            <Flex align="center" gap="3" mb="4">
              <Box style={{ color: "var(--green-9)" }}>
                <GearIcon style={{ width: "20px", height: "20px" }} />
              </Box>
              <Box>
                <Heading size="4" mb="1">Application Settings</Heading>
                <Text size="2" color="gray">Configure application behavior</Text>
              </Box>
            </Flex>
            <Button variant="soft" size="2">
              Configure
            </Button>
          </Card>
        </Box>
      </Container>
    </AppShell>
  );
}