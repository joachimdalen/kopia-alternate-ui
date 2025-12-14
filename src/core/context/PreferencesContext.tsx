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
import type { Preferences } from "../types";
type ContextState = Preferences & {
  reload: () => void;
};
const initialState: ContextState = {
  bytesStringBase2: true,
  defaultSnapshotViewAll: false,
  fontSize: "fs-6",
  language: "",
  pageSize: 20,
  theme: "light",
  reload: () => {},
};

const PreferencesContext = createContext<ContextState>(initialState);

export type PreferencesContextProps = PropsWithChildren;
export function PreferencesContextProvider({
  children,
}: PreferencesContextProps) {
  const [data, setData] = useState<Preferences>(initialState);
  const loadPreferences = useApiRequest({
    action: () => kopiaService.getPreferences(),
    onReturn(resp) {
      setData(resp);
    },
  });
  useEffect(() => {
    loadPreferences.execute(undefined, "loading");
  }, []);

  const reloadPrefs = useCallback(() => {
    loadPreferences.execute();
  }, []);

  return (
    <PreferencesContext.Provider
      value={{
        ...data,
        reload: reloadPrefs,
      }}
    >
      {loadPreferences.loading ? <LoadingOverlay visible /> : children}
    </PreferencesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error(
      "usePreferencesContext must be used within a PreferencesContextProvider"
    );
  }
  return context;
}
