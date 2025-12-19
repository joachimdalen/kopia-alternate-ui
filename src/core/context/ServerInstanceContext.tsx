import { LoadingOverlay } from "@mantine/core";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import useApiRequest from "../hooks/useApiRequest";
import { KopiaService, type IKopiaService } from "../kopiaService2";
import uiService, { type Instance } from "../uiService";
type ContextState = {
  servers: Instance[];
  currentServer?: Instance;
  setServer: (server: Instance) => void;
  kopiaService: IKopiaService;
};
const initialState: ContextState = {
  servers: [],
  setServer: () => {},
  kopiaService: {} as IKopiaService,
};

const ServerInstanceContext = createContext<ContextState>(initialState);

export type ServerInstanceContextProps = PropsWithChildren;
export function ServerInstanceContextProvider({
  children,
}: ServerInstanceContextProps) {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [currentInstance, setCurrentInstance] = useState<Instance>();

  const getInstances = useApiRequest({
    action: () => uiService.getInstances(),
    onReturn(resp) {
      setInstances(resp);
      setCurrentInstance(resp[0]);
    },
  });
  useEffect(() => {
    getInstances.execute(undefined, "loading");
  }, []);

  const setServer = useCallback((server: Instance) => {
    setCurrentInstance(server);
  }, []);

  const kopiaInstance = useMemo(() => {
    console.log("CHANGING INSTANCE");
    return new KopiaService(currentInstance?.id || "main");
  }, [currentInstance]);

  const loading = getInstances.loading;

  return (
    <ServerInstanceContext.Provider
      value={{
        servers: instances,
        currentServer: currentInstance,
        setServer,
        kopiaService: kopiaInstance,
      }}
    >
      {loading ? <LoadingOverlay visible /> : children}
    </ServerInstanceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useServerInstanceContext() {
  const context = useContext(ServerInstanceContext);
  if (context === undefined) {
    throw new Error(
      "useServerInstanceContext must be used within a ServerInstanceContextProvider"
    );
  }
  return context;
}
