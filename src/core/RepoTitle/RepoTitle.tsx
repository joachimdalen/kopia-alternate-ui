import { Title } from "@mantine/core";
import { useAppContext } from "../context/AppContext";

export default function RepoTitle() {
  const { repoStatus } = useAppContext();
  return <Title order={1}>{repoStatus.description}</Title>;
}
