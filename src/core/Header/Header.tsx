import { t } from "@lingui/core/macro";
import {
  Anchor,
  AppShellHeader,
  Box,
  Burger,
  Center,
  Container,
  Divider,
  Group,
  HoverCard,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandGithub,
  IconChevronDown,
  IconClipboardCheck,
  IconDatabase,
  IconFileCertificate,
  IconFolderBolt,
  IconPackage,
  IconSettings
} from "@tabler/icons-react";
import cx from "clsx";
import { useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useAppContext } from "../context/AppContext";
import IconWrapper from "../IconWrapper";
import classes from "./Header.module.css";

type Link1 = {
  id: string;
  label: string;
  disabled?: boolean;
  links: Link2[];
  icon: typeof IconSettings;
};
type Link2 = {
  link: string;
  label: string;
  disabled?: boolean;
  icon: typeof IconSettings;
  description?: string;
};
type AllLinks = Link1 | Link2;

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const { repoStatus } = useAppContext();
  const location = useLocation();

  const links: AllLinks[] = useMemo(() => {
    return [
      {
        id: "snapshots-section",
        label: t`Snapshots`,
        disabled: !repoStatus.connected,
        icon: IconPackage,
        links: [
          {
            link: "/snapshots",
            label: t`Snapshots`,
            disabled: !repoStatus.connected,
            icon: IconPackage,
            description: t`Manage snapshots`
          },
          {
            link: "/mounts",
            label: t`Mounts`,
            disabled: !repoStatus.connected,
            icon: IconFolderBolt,
            description: t`Manage mounted snapshots`
          }
        ]
      },
      {
        id: "repo-section",
        label: t`Repository`,
        icon: IconDatabase,
        links: [
          {
            link: "/repo",
            label: t`Status`,
            icon: IconDatabase,
            description: t`Manage repository status and configuration`
          },
          {
            link: "/policies",
            label: t`Policies`,
            disabled: !repoStatus.connected,
            icon: IconFileCertificate,
            description: t`Manage snapshot policies for this repository`
          }
        ]
      },
      { link: "/tasks", label: t`Tasks`, icon: IconClipboardCheck },
      { link: "/preferences", label: t`Preferences`, icon: IconSettings },
      {
        link: "ext:https://github.com/joachimdalen/kopia-alternate-ui",
        label: "GitHub",
        icon: IconBrandGithub
      }
    ] satisfies AllLinks[];
  }, [repoStatus]);

  const items = links.map((link) => {
    if ("links" in link) {
      const links2 = link.links.map((item) => {
        const body = (
          <Group wrap="nowrap" align="flex-start">
            <ThemeIcon size={34} variant="default" radius="md">
              <IconWrapper icon={item.icon} size={22} />
            </ThemeIcon>
            <div>
              <Text size="sm" fw={500}>
                {item.label}
              </Text>
              <Text size="xs" c="dimmed">
                {item.description}
              </Text>
            </div>
          </Group>
        );

        if (item.disabled) {
          return (
            <a
              key={link.label}
              aria-disabled
              className={cx(classes.subLink, { [classes.active]: item.link === location.pathname })}
            >
              {body}
            </a>
          );
        }

        return (
          <UnstyledButton
            className={cx(classes.subLink, { [classes.active]: item.link === location.pathname })}
            key={item.link}
            component={NavLink}
            to={item.link}
          >
            {body}
          </UnstyledButton>
        );
      });
      return (
        <HoverCard
          width={600}
          position="bottom"
          radius="md"
          shadow="md"
          withinPortal
          key={link.id}
          disabled={link.links.every((x) => x.disabled)}
        >
          <HoverCard.Target>
            <UnstyledButton
              className={cx(classes.link, { [classes.active]: link.links.some((x) => x.link === location.pathname) })}
            >
              <Center>
                <IconWrapper icon={link.icon} size={14} />
                <Box component="span" mx={5}>
                  {link.label}
                </Box>
                <IconWrapper icon={IconChevronDown} size={14} />
              </Center>
            </UnstyledButton>
          </HoverCard.Target>

          <HoverCard.Dropdown style={{ overflow: "hidden" }}>
            <Text fw={500} px="md">
              {link.label}
            </Text>

            <Divider my="sm" />

            <SimpleGrid cols={2} spacing={2}>
              {links2}
            </SimpleGrid>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    }

    if (link.disabled) {
      return (
        <a key={link.label} aria-disabled className={classes.link}>
          <Group gap={5}>
            <IconWrapper icon={link.icon} size={14} />
            {link.label}
          </Group>
        </a>
      );
    }
    if (link.link.startsWith("ext:")) {
      return (
        <Anchor key={link.label} href={link.link.replace("ext:", "")} className={classes.link} target="_blank">
          <Group gap={5}>
            <IconWrapper icon={link.icon} size={14} />
            {link.label}
          </Group>
        </Anchor>
      );
    }
    return (
      <NavLink key={link.label} to={link.link} className={classes.link}>
        <Group gap={5}>
          <IconWrapper icon={link.icon} size={14} />
          {link.label}
        </Group>
      </NavLink>
    );
  });

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
