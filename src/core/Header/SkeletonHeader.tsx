import { AppShellHeader, Box, Container, Text } from "@mantine/core";
import { Link } from "react-router";
import classes from "./Header.module.css";

export function SkeletonHeader() {
  return (
    <AppShellHeader className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Box>
          <Link to="/" className={classes.title}>
            <Text fw="bold" c="white" fz="lg">
              Kopia UI
            </Text>
          </Link>
        </Box>
      </Container>
    </AppShellHeader>
  );
}
