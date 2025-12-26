import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
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
        <Text fw="bold">
          <Trans>Use Repository Token</Trans>
        </Text>
      </Group>

      <PasswordInput
        label={t`Token`}
        withAsterisk
        placeholder={t`Paste connection token`}
        {...form.getInputProps("providerConfig.token")}
      />
    </Stack>
  );
}

export default KopiaRepoTokenRepo;
