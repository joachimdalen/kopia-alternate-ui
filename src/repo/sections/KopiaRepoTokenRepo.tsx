import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, PasswordInput, Stack, Text } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconAsterisk } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<KopiaRepoTokenRepoConfig>>;
};

export type KopiaRepoTokenRepoConfig = {
  token: string;
};

export const kopiaRepoTokenRepoConfigDefault: KopiaRepoTokenRepoConfig = {
  token: ""
};

export const kopiaRepoTokenRepoConfigSchema = (): ObjectSchema<KopiaRepoTokenRepoConfig> =>
  object({
    token: string().required().label(t`Token`)
  });

export function KopiaRepoTokenRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconAsterisk} size={32} color="violet" />
      <Text fw="bold">
        <Trans>Use Repository Token</Trans>
      </Text>
    </Group>
  );
}

function KopiaRepoTokenRepo({ form }: Props) {
  return (
    <Stack>
      <KopiaRepoTokenRepoHeader />
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
