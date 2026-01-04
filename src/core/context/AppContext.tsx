import { useLingui } from "@lingui/react/macro";
import { LoadingOverlay, useMantineColorScheme } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { parseColorScheme } from "../../utils/parseColorScheme";
import useApiRequest from "../hooks/useApiRequest";
import type { Preferences, Status } from "../types";
import { useServerInstanceContext } from "./ServerInstanceContext";

type ContextState = Preferences & {
  reloadPreferences: () => void;
  reloadStatus: () => void;
  setShowStatistics: (value: boolean) => void;
  repoStatus: Status;
  showStatistics: boolean;
};
const initialState: ContextState = {
  bytesStringBase2: true,
  defaultSnapshotViewAll: false,
  fontSize: "fs-6",
  language: "",
  locale: "en",
  pageSize: 20,
  theme: "light",
  showStatistics: true,
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is not set in inital state
  reloadPreferences: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is not set in inital state
  reloadStatus: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is not set in inital state
  setShowStatistics: () => {},
  repoStatus: {
    connected: false,
    description: "Unknown"
  } as Status
};

const AppContext = createContext<ContextState>(initialState);

export type AppContextProps = PropsWithChildren;
export function AppContextProvider({ children }: AppContextProps) {
  const { i18n } = useLingui();
  const { kopiaService } = useServerInstanceContext();
  const [data, setData] = useState<Preferences>(initialState);
  const [status, setStatus] = useState<Status>();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const [intShowStats, setShowStatistics] = useLocalStorage({ key: "kopia-alt-ui-snapshot-stats", defaultValue: true });

  const navigate = useNavigate();
  const loadPreferences = useApiRequest({
    showErrorAsNotification: true,
    action: () => kopiaService.getPreferences(),
    onReturn(resp) {
      const theme = parseColorScheme(resp.theme);
      setData({
        bytesStringBase2: resp.bytesStringBase2,
        defaultSnapshotViewAll: resp.defaultSnapshotViewAll,
        language: resp.language,
        fontSize: resp.fontSize,
        pageSize: resp.pageSize === 0 ? 20 : resp.pageSize,
        theme: theme,
        locale: resp.locale || "en"
      });
      if (colorScheme !== theme) {
        setColorScheme(theme);
      }
      i18n.activate(resp.locale || "en");
    }
  });
  const loadStatus = useApiRequest({
    action: () => kopiaService.getStatus(),
    onReturn(resp) {
      setStatus(resp);
      if (!resp.connected) {
        navigate("/repo");
      }
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: need-to-fix-later
  useEffect(() => {
    loadPreferences.execute(undefined, "loading");
    loadStatus.execute(undefined, "loading");
  }, [kopiaService]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: implicit reference
  const reloadPrefs = useCallback(() => {
    loadPreferences.execute();
  }, [kopiaService]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: implicit reference
  const reloadStatus = useCallback(() => {
    loadStatus.execute();
  }, [kopiaService]);

  const loading = loadPreferences.loading || loadStatus.loadingKey === "loading";

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
            description: "Unknown"
          } as Status),
        showStatistics: intShowStats,
        setShowStatistics
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
