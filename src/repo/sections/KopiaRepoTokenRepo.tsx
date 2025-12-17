import { Group, PasswordInput, Stack, Text } from "@mantine/core";
import { IconAsterisk } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";

function KopiaRepoTokenRepo() {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconAsterisk} size={32} color="violet" />
        <Text fw="bold">Use Repository Token</Text>
      </Group>

      <PasswordInput label="Token" placeholder="Paste connection token" />
    </Stack>
  );
}

export default KopiaRepoTokenRepo;
