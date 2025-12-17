import { Group, Stack, Text, TextInput } from "@mantine/core";
import { IconServer } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function KopiaRepoServerRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconServer} size={32} color="lime" />
        <Text fw="bold">Kopia Repository Server</Text>
      </Group>

      <Stack>
        <TextInput
          label="Server address"
          placeholder="Enter server URL (https://<host>:port)"
          withAsterisk
        />
        <TextInput
          label="Trusted server certificate fingerprint (SHA256)"
          placeholder="Enter trusted server certificate fingerprint printed at server startup"
        />
      </Stack>
    </Stack>
  );
}

export default KopiaRepoServerRepo;
