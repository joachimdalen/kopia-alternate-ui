import { t } from "@lingui/core/macro";
import { LoadingOverlay } from "@mantine/core";
import { useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import useApiRequest from "../hooks/useApiRequest";
import { type IKopiaService, type KopiaAuth, KopiaService } from "../kopiaService";
import SkeletonLayout from "../SkeletonLayout";
import uiService, { type Instance } from "../uiService";
import LoginModal from "./LoginModal";

type ContextState = {
  servers: Instance[];
  currentServer?: Instance;
  setServer: (server: Instance) => void;
  logoutFromServer: (id: string) => void;
  kopiaService: IKopiaService;
};

const initialState: ContextState = {
  servers: [],
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is not set in inital state
  setServer: () => {},
  // biome-ignore lint/suspicious/noEmptyBlockStatements: is not set in inital state
  logoutFromServer: () => {},
  kopiaService: {} as IKopiaService
};

const ServerInstanceContext = createContext<ContextState>(initialState);

export type ServerInstanceContextProps = PropsWithChildren;
export function ServerInstanceContextProvider({ children }: ServerInstanceContextProps) {
  const navigate = useNavigate();
  const [instances, setInstances] = useState<Instance[]>([]);
  const [currentInstance, setCurrentInstance] = useState<Instance>();
  const [loginRequired, setLoginRequired] = useState(false);
  const [loginInfo, setLoginInfo] = useSessionStorage<Record<string, KopiaAuth>>({
    key: "kopia-alt-ui-auth"
  });
  const [lastInstance, setLastInstance] = useLocalStorage<string>({
    key: "kopia-alt-ui-last-instance",
    getInitialValueInEffect: false
  });

  const getInstances = useApiRequest({
    action: () => uiService.getInstances(),
    onReturn(resp) {
      setInstances(resp);

      let defaultInstance = resp.find((x) => x.id == lastInstance);
      if (defaultInstance === undefined) {
        defaultInstance = resp.find((x) => x.default);
      }

      setCurrentInstance(defaultInstance || resp[0]);
    }
  });
  const loginAction = useApiRequest({
    action: (auth?: { instance: string; username: string; password: string }) =>
      kopiaInstance.login(auth!.username, auth!.password),
    onReturn(res, req) {
      setLoginRequired(false);

      notifications.clean();
      if (req) {
        setLoginInfo({
          ...loginInfo,
          [req.instance]: {
            username: req.username,
            password: req.password
          }
        });
      }
      if (!res.connected) {
        navigate("/repo");
      }
    }
  });
  useEffect(() => {
    getInstances.execute(undefined, "loading");
  }, []);

  const setServer = useCallback((server: Instance) => {
    const currentName = server.name || server.id;
    setCurrentInstance(server);
    setLastInstance(server.id);
    notifications.show({
      title: t`Switched instance`,
      message: t`Currently browsing instance ${currentName}`
    });
  }, []);

  const logoutFromServer = useCallback(
    (id: string) => {
      const newLoginInfo = {
        ...loginInfo
      };
      delete newLoginInfo[id];
      setLoginInfo(newLoginInfo);
    },
    [loginInfo, setLoginInfo]
  );

  const kopiaInstance = useMemo(() => {
    if (currentInstance === undefined) {
      return {} as IKopiaService;
    }

    const loginForInstance = loginInfo === undefined ? undefined : loginInfo[currentInstance.id];

    return new KopiaService(
      currentInstance?.id || "main",
      () => {
        setLoginRequired(true);
      },
      loginForInstance
    );
  }, [currentInstance, loginInfo]);

  const loading = getInstances.loading;

  return (
    <ServerInstanceContext.Provider
      value={{
        servers: instances,
        currentServer: currentInstance,
        setServer,
        logoutFromServer,
        kopiaService: kopiaInstance
      }}
    >
      {loginRequired && currentInstance && (
        <SkeletonLayout>
          <LoginModal
            error={loginAction.error}
            onLogin={(username, password) => {
              loginAction.execute({
                instance: currentInstance.id,
                username,
                password
              });
            }}
            instance={currentInstance}
          />
        </SkeletonLayout>
      )}
      {loginRequired ? null : loading || currentInstance === undefined ? <LoadingOverlay visible /> : children}
    </ServerInstanceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useServerInstanceContext() {
  const context = useContext(ServerInstanceContext);
  if (context === undefined) {
    throw new Error("useServerInstanceContext must be used within a ServerInstanceContextProvider");
  }
  return context;
}
