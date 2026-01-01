import { useAppContext } from "../core/context/AppContext";
import ConfigureRepoSection from "./ConfigureRepoSection";
import ConnectedRepoSection from "./ConnectedRepoSection/ConnectedRepoSection";

function RepoPage() {
  const { repoStatus } = useAppContext();
  if (repoStatus.connected) {
    return <ConnectedRepoSection />;
  }
  return <ConfigureRepoSection />;
}

export default RepoPage;
