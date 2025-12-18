import { Group, PasswordInput, Stack, Text } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconAsterisk } from "@tabler/icons-react";
import IconWrapper from "../../core/IconWrapper";
import type { KopiaRepoTokenRepoConfig, RepoConfigurationForm } from "../types";
type Props = {
  form: UseFormReturnType<RepoConfigurationForm<KopiaRepoTokenRepoConfig>>;
};
function KopiaRepoTokenRepo({ form }: Props) {
  return (
    <Stack>
      <Group>
        <IconWrapper icon={IconAsterisk} size={32} color="violet" />
        <Text fw="bold">Use Repository Token</Text>
      </Group>

      <PasswordInput
        label="Token"
        withAsterisk
        placeholder="Paste connection token"
        {...form.getInputProps("providerConfig.token")}
      />
    </Stack>
  );
}

export default KopiaRepoTokenRepo;
