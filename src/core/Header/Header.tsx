import {
  AppShellHeader,
  Box,
  Burger,
  Container,
  Group,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";
import { Link, NavLink } from "react-router";
import { useAppContext } from "../context/AppContext";
import classes from "./Header.module.css";

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const { repoStatus } = useAppContext();

  const links = useMemo(() => {
    return [
      {
        link: "/snapshots",
        label: "Snapshots",
        disabled: !repoStatus.connected,
      },
      { link: "/policies", label: "Policies", disabled: !repoStatus.connected },
      { link: "/tasks", label: "Tasks" },
      { link: "/repo", label: "Repository" },
      { link: "/preferences", label: "Preferences" },
    ];
  }, [repoStatus]);

  const items = links.map((link) =>
    link.disabled ? (
      <a key={link.label} aria-disabled className={classes.link}>
        {link.label}
      </a>
    ) : (
      <NavLink key={link.label} to={link.link} className={classes.link}>
        {link.label}
      </NavLink>
    )
  );

  return (
    <AppShellHeader className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Box>
          <Link to="/">
            <Text fw="bold" td="none" c="white" fz="lg">
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
