import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { Group, Stack, Text, TextInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { IconServer } from "@tabler/icons-react";
import { ObjectSchema, object, string } from "yup";
import IconWrapper from "../../core/IconWrapper";
import type { RepoConfigurationForm } from "../types";

type Props = {
  form: UseFormReturnType<RepoConfigurationForm<KopiaRepoServerRepoConfig>>;
};

export type KopiaRepoServerRepoConfig = {
  url: string;
  serverCertFingerprint?: string;
};
export const kopiaRepoServerRepoConfigDefault: KopiaRepoServerRepoConfig = {
  url: "",
  serverCertFingerprint: ""
};

export const kopiaRepoServerRepoConfigSchema = (): ObjectSchema<KopiaRepoServerRepoConfig> =>
  object({
    url: string().required().label(t`Server address`),
    serverCertFingerprint: string().optional().label(t`Trusted server certificate fingerprint (SHA256)`)
  });

export function KopiaRepoServerRepoHeader() {
  return (
    <Group>
      <IconWrapper icon={IconServer} size={32} color="lime" />
      <Text fw="bold">
        <Trans>Kopia Repository Server</Trans>
      </Text>
    </Group>
  );
}

function KopiaRepoServerRepo({ form }: Props) {
  return (
    <Stack>
      <KopiaRepoServerRepoHeader />
      <Stack>
        <TextInput
          label={t`Server address`}
          placeholder={t`Enter server URL (https://<host>:port)`}
          withAsterisk
          {...form.getInputProps("providerConfig.url")}
        />
        <TextInput
          label={t`Trusted server certificate fingerprint (SHA256)`}
          placeholder={t`Enter trusted server certificate fingerprint printed at server startup`}
          {...form.getInputProps("providerConfig.serverCertFingerprint")}
        />
      </Stack>
    </Stack>
  );
}

export default KopiaRepoServerRepo;
