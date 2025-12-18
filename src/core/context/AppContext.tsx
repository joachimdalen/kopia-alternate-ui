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
import kopiaService from "../kopiaService";
import type { Preferences, Status } from "../types";
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
  const [data, setData] = useState<Preferences>(initialState);
  const [status, setStatus] = useState<Status>();
  const loadPreferences = useApiRequest({
    action: () => kopiaService.getPreferences(),
    onReturn(resp) {
      setData(resp);
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
  }, []);

  const reloadPrefs = useCallback(() => {
    loadPreferences.execute();
  }, []);

  const reloadStatus = useCallback(() => {
    loadStatus.execute();
  }, []);

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
      {loadPreferences.loading ? <LoadingOverlay visible /> : children}
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
