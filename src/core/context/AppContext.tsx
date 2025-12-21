import { LoadingOverlay } from "@mantine/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import useApiRequest from "../hooks/useApiRequest";
import type { Preferences, Status } from "../types";
import { useServerInstanceContext } from "./ServerInstanceContext";
type ContextState = Preferences & {
  reloadPreferences: () => void;
  reloadStatus: () => void;
  repoStatus: Status;
};
const initialState: ContextState = {
  bytesStringBase2: true,
  defaultSnapshotViewAll: false,
  fontSize: "fs-6",
  language: "",
  locale: "en",
  pageSize: 20,
  theme: "light",
  reloadPreferences: () => {},
  reloadStatus: () => {},
  repoStatus: {
    connected: false,
    description: "Unknown",
  } as Status,
};

const AppContext = createContext<ContextState>(initialState);

export type AppContextProps = PropsWithChildren;
export function AppContextProvider({ children }: AppContextProps) {
  const { kopiaService } = useServerInstanceContext();
  const [data, setData] = useState<Preferences>(initialState);
  const [status, setStatus] = useState<Status>();
  const loadPreferences = useApiRequest({
    showErrorAsNotification: true,
    action: () => kopiaService.getPreferences(),
    onReturn(resp) {
      setData({
        bytesStringBase2: resp.bytesStringBase2,
        defaultSnapshotViewAll: resp.defaultSnapshotViewAll,
        language: resp.language,
        fontSize: resp.fontSize,
        pageSize: resp.pageSize === 0 ? 20 : resp.pageSize,
        theme: resp.theme === "" ? "light" : "dark",
        locale: resp.locale || "en",
      });
    },
  });
  const loadStatus = useApiRequest({
    action: () => kopiaService.getStatus(),
    onReturn(resp) {
      setStatus(resp);
    },
  });

  useEffect(() => {
    loadPreferences.execute(undefined, "loading");
    loadStatus.execute(undefined, "loading");
  }, [kopiaService]);

  const reloadPrefs = useCallback(() => {
    loadPreferences.execute();
  }, [kopiaService]);

  const reloadStatus = useCallback(() => {
    loadStatus.execute();
  }, [kopiaService]);

  const loading =
    loadPreferences.loading || loadStatus.loadingKey === "loading";

  return (
    <AppContext.Provider
      value={{
        ...data,
        reloadPreferences: reloadPrefs,
        reloadStatus: reloadStatus,
        repoStatus:
          status ??
          ({
            connected: false,
            description: "Unknown",
          } as Status),
      }}
    >
      {loading ? <LoadingOverlay visible /> : children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
}
