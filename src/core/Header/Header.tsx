import { t } from "@lingui/core/macro";
import { Anchor, AppShellHeader, Box, Burger, Container, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandGithub,
  IconClipboardCheck,
  IconDatabase,
  IconFileCertificate,
  IconFolderBolt,
  IconPackage,
  IconSettings
} from "@tabler/icons-react";
import { useMemo } from "react";
import { Link, NavLink } from "react-router";
import { useAppContext } from "../context/AppContext";
import IconWrapper from "../IconWrapper";
import classes from "./Header.module.css";
export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const { repoStatus } = useAppContext();

  const links = useMemo(() => {
    return [
      {
        link: "/snapshots",
        label: t`Snapshots`,
        disabled: !repoStatus.connected,
        icon: IconPackage
      },
      {
        link: "/mounts",
        label: t`Mounts`,
        disabled: !repoStatus.connected,
        icon: IconFolderBolt
      },
      {
        link: "/policies",
        label: t`Policies`,
        disabled: !repoStatus.connected,
        icon: IconFileCertificate
      },
      { link: "/tasks", label: t`Tasks`, icon: IconClipboardCheck },
      { link: "/repo", label: t`Repository`, icon: IconDatabase },
      { link: "/preferences", label: t`Preferences`, icon: IconSettings },
      {
        link: "ext:https://github.com/joachimdalen/kopia-alternate-ui",
        label: "GitHub",
        icon: IconBrandGithub
      }
    ];
  }, [repoStatus]);

  const items = links.map((link) =>
    link.disabled ? (
      <a key={link.label} aria-disabled className={classes.link}>
        <Group gap={5}>
          <IconWrapper icon={link.icon} size={14} />
          {link.label}
        </Group>
      </a>
    ) : link.link.startsWith("ext:") ? (
      <Anchor key={link.label} href={link.link.replace("ext:", "")} className={classes.link} target="_blank">
        <Group gap={5}>
          <IconWrapper icon={link.icon} size={14} />
          {link.label}
        </Group>
      </Anchor>
    ) : (
      <NavLink key={link.label} to={link.link} className={classes.link}>
        <Group gap={5}>
          <IconWrapper icon={link.icon} size={14} />
          {link.label}
        </Group>
      </NavLink>
    )
  );

  return (
    <AppShellHeader className={classes.header}>
      <Container size="md" fluid className={classes.inner}>
        <Box>
          <Link to="/" className={classes.title}>
            <Text fw="bold" c="white" fz="lg">
              Kopia UI
            </Text>
          </Link>
        </Box>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </AppShellHeader>
  );
}
