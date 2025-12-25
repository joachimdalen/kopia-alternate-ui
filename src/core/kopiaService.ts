import axios from "axios";
import type {
  AlgorithmsList,
  ApiResponse,
  CheckRepoRequest,
  ConnectRepoRequest,
  CreateSnapshotRequest,
  CurrentUser,
  DeleteSnapshotRequest,
  DirManifest,
  EstimateSnapshotRequest,
  MountedSnapshot,
  MountSnapshotRequest,
  MountsResponse,
  NotificationProfile,
  PoliciesList,
  Policy,
  Preferences,
  ResolvedPolicy,
  ResolvePath,
  ResolvePolicyRequest,
  RestoreRequest,
  Snapshot,
  Snapshots,
  SourceInfo,
  Sources,
  Status,
  Task,
  TaskList,
  TasksSummary
} from "./types";
type QueryParams = { [key: string]: string | boolean | number };
export type KopiaAuth = {
  username: string;
  password: string;
};
export interface IKopiaService {
  getSnapshots(): Promise<ApiResponse<Sources>>;
  startSnapshot(sourceInfo: SourceInfo): Promise<ApiResponse<Task>>;
  getSnapshot(query: { [key: string]: string }): Promise<ApiResponse<Snapshots>>;
  updateDescription(snapshotIds: string[], description: string): Promise<ApiResponse<Snapshot[]>>;
  addPin(snapshotId: string, pin: string): Promise<ApiResponse<Snapshot[]>>;
  updatePin(snapshotId: string, currentPin: string, pin: string): Promise<ApiResponse<Snapshot[]>>;
  removePin(snapshotId: string, pin: string): Promise<ApiResponse<Snapshot[]>>;
  getObjects(oid: string): Promise<ApiResponse<DirManifest>>;
  restore(data: RestoreRequest): Promise<ApiResponse<Task>>;
  getTasks(): Promise<ApiResponse<TaskList>>;
  getTask(taskId: string): Promise<ApiResponse<Task>>;
  getTaskLogs(taskId: string): Promise<
    ApiResponse<{
      logs: {
        level: number;
        ts: number;
        msg: string;
        mod: string;
      }[];
    }>
  >;
  getStatus(): Promise<ApiResponse<Status>>;
  getPolicies(): Promise<ApiResponse<PoliciesList>>;
  getAlgorithms(): Promise<ApiResponse<AlgorithmsList>>;
  getPolicy(source: SourceInfo): Promise<ApiResponse<Policy>>;
  savePolicy(policy: Policy, source: SourceInfo): Promise<ApiResponse<Policy>>;
  deletePolicy(sourceInfo: SourceInfo): Promise<ApiResponse<unknown>>;
  getTasksSummary(): Promise<ApiResponse<TasksSummary>>;
  resolvePolicy(source: SourceInfo, data: ResolvePolicyRequest): Promise<ApiResponse<ResolvedPolicy>>;
  getPreferences(): Promise<ApiResponse<Preferences>>;
  setPreferences(data: Preferences): Promise<ApiResponse<Preferences>>;
  getNotificationProfiles(): Promise<ApiResponse<NotificationProfile[]>>;
  createNotificationProfile(profile: NotificationProfile): Promise<ApiResponse<NotificationProfile>>;

  deleteNotificationProfile(profileName: string): Promise<ApiResponse<unknown>>;
  testNotificationProfile(profile: NotificationProfile): Promise<ApiResponse<unknown>>;

  resolvePath(path: string): Promise<ApiResponse<ResolvePath>>;
  estimateSnapshot(data: EstimateSnapshotRequest): Promise<ApiResponse<Task>>;
  createSnapshot(data: CreateSnapshotRequest): Promise<ApiResponse<Task>>;
  getCurrentUser(): Promise<ApiResponse<CurrentUser>>;
  repoExists(data: CheckRepoRequest): Promise<ApiResponse<unknown>>;
  connectRepo(data: ConnectRepoRequest): Promise<ApiResponse<unknown>>;
  createRepo(data: object): Promise<ApiResponse<unknown>>;
  disconnectRepo(): Promise<ApiResponse<unknown>>;
  updateRepoDescription(description: string): Promise<ApiResponse<unknown>>;
  deleteSnapshot(data: DeleteSnapshotRequest): Promise<ApiResponse<unknown>>;
  syncRepo(): Promise<ApiResponse<unknown>>;
  login(username: string, password: string): Promise<ApiResponse<Status>>;
  mountSnapshot(root: string): Promise<ApiResponse<MountedSnapshot>>;
  getMountedSnapshot(root: string): Promise<ApiResponse<MountedSnapshot>>;
  unMountSnapshot(root: string): Promise<ApiResponse<unknown>>;
  getMountedSnapshots(): Promise<ApiResponse<MountsResponse>>;
}

export class KopiaService implements IKopiaService {
  private instance: string;
  private authInfo?: KopiaAuth;
  private onAuthRequired: () => void;
  private defaultHeaders: Record<string, string> = {
    "Content-type": "application/json",
    Accept: "application/json"
  };
  constructor(instance: string, onAuthRequired: () => void, authInfo?: KopiaAuth) {
    this.instance = instance;
    this.onAuthRequired = onAuthRequired;
    this.authInfo = authInfo;
  }

  public getSnapshots(): Promise<ApiResponse<Sources>> {
    return this.get(`/api/${this.instance}/v1/sources`);
  }

  public startSnapshot(sourceInfo: SourceInfo): Promise<ApiResponse<Task>> {
    return this.post(`/api/${this.instance}/v1/sources/upload`, undefined, sourceInfo);
  }
  public getSnapshot(query: { [key: string]: string }): Promise<ApiResponse<Snapshots>> {
    return this.get(`/api/${this.instance}/v1/snapshots`, query);
  }
  public updateDescription(snapshotIds: string[], description: string): Promise<ApiResponse<Snapshot[]>> {
    return this.post(`/api/${this.instance}/v1/snapshots/edit`, {
      description,
      snapshots: snapshotIds
    });
  }
  public addPin(snapshotId: string, pin: string): Promise<ApiResponse<Snapshot[]>> {
    return this.post(`/api/${this.instance}/v1/snapshots/edit`, {
      addPins: [pin],
      removePins: [],
      snapshots: [snapshotId]
    });
  }
  public updatePin(snapshotId: string, currentPin: string, pin: string): Promise<ApiResponse<Snapshot[]>> {
    return this.post(`/api/${this.instance}/v1/snapshots/edit`, {
      addPins: [pin],
      removePins: [currentPin],
      snapshots: [snapshotId]
    });
  }
  public removePin(snapshotId: string, pin: string): Promise<ApiResponse<Snapshot[]>> {
    return this.post(`/api/${this.instance}/v1/snapshots/edit`, {
      removePins: [pin],
      snapshots: [snapshotId]
    });
  }
  public getObjects(oid: string): Promise<ApiResponse<DirManifest>> {
    return this.get(`/api/${this.instance}/v1/objects/${oid}`);
  }

  public restore(data: RestoreRequest): Promise<ApiResponse<Task>> {
    return this.post(`/api/${this.instance}/v1/restore`, data);
  }
  public getTasks(): Promise<ApiResponse<TaskList>> {
    return this.get(`/api/${this.instance}/v1/tasks`);
  }
  public getTask(taskId: string): Promise<ApiResponse<Task>> {
    return this.get(`/api/${this.instance}/v1/tasks/${taskId}`);
  }
  public getTaskLogs(taskId: string): Promise<
    ApiResponse<{
      logs: {
        level: number;
        ts: number;
        msg: string;
        mod: string;
      }[];
    }>
  > {
    return this.get(`/api/${this.instance}/v1/tasks/${taskId}/logs`);
  }
  public getStatus(): Promise<ApiResponse<Status>> {
    return this.get(`/api/${this.instance}/v1/repo/status`);
  }
  public login(username: string, password: string): Promise<ApiResponse<Status>> {
    return this.get(`/api/${this.instance}/v1/repo/status`, undefined, {
      username,
      password
    });
  }
  public getPolicies(): Promise<ApiResponse<PoliciesList>> {
    return this.get(`/api/${this.instance}/v1/policies`);
  }

  public getAlgorithms(): Promise<ApiResponse<AlgorithmsList>> {
    return this.get(`/api/${this.instance}/v1/repo/algorithms`);
  }
  public getPolicy(source: SourceInfo): Promise<ApiResponse<Policy>> {
    return this.get(`/api/${this.instance}/v1/policy`, source);
  }
  public savePolicy(policy: Policy, source: SourceInfo): Promise<ApiResponse<Policy>> {
    return this.put(`/api/${this.instance}/v1/policy`, policy, source);
  }
  public deletePolicy(source: SourceInfo): Promise<ApiResponse<unknown>> {
    return this.delete(`/api/${this.instance}/v1/policy`, source);
  }
  public getTasksSummary(): Promise<ApiResponse<TasksSummary>> {
    return this.get(`/api/${this.instance}/v1/tasks-summary`);
  }
  public resolvePolicy(source: SourceInfo, data: ResolvePolicyRequest): Promise<ApiResponse<ResolvedPolicy>> {
    return this.post(`/api/${this.instance}/v1/policy/resolve`, data, source);
  }
  public getPreferences(): Promise<ApiResponse<Preferences>> {
    return this.get(`/api/${this.instance}/v1/ui-preferences`);
  }
  public setPreferences(data: Preferences): Promise<ApiResponse<Preferences>> {
    return this.put(`/api/${this.instance}/v1/ui-preferences`, data);
  }

  public getNotificationProfiles(): Promise<ApiResponse<NotificationProfile[]>> {
    return this.get(`/api/${this.instance}/v1/notificationProfiles`);
  }
  public createNotificationProfile(profile: NotificationProfile): Promise<ApiResponse<NotificationProfile>> {
    return this.post(`/api/${this.instance}/v1/notificationProfiles`, profile);
  }
  public deleteNotificationProfile(profileName: string): Promise<ApiResponse<unknown>> {
    return this.delete(`/api/${this.instance}/v1/notificationProfiles/${profileName}`);
  }
  public testNotificationProfile(profile: NotificationProfile): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/testNotificationProfile`, profile);
  }
  public resolvePath(path: string): Promise<ApiResponse<ResolvePath>> {
    return this.post(`/api/${this.instance}/v1/paths/resolve`, {
      path
    });
  }
  public estimateSnapshot(data: EstimateSnapshotRequest): Promise<ApiResponse<Task>> {
    return this.post(`/api/${this.instance}/v1/estimate`, data);
  }
  public createSnapshot(data: CreateSnapshotRequest): Promise<ApiResponse<Task>> {
    return this.post(`/api/${this.instance}/v1/sources`, data);
  }
  public getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
    return this.get(`/api/${this.instance}/v1/current-user`);
  }
  public repoExists(data: CheckRepoRequest): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/repo/exists`, data);
  }
  public connectRepo(data: ConnectRepoRequest): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/repo/connect`, data);
  }
  public createRepo(data: object): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/repo/create`, data);
  }
  public disconnectRepo(): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/repo/disconnect`);
  }
  public updateRepoDescription(description: string): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/repo/description`, {
      description
    });
  }
  public deleteSnapshot(data: DeleteSnapshotRequest): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/snapshots/delete`, data);
  }
  public syncRepo(): Promise<ApiResponse<unknown>> {
    return this.post(`/api/${this.instance}/v1/repo/sync`);
  }

  public mountSnapshot(root: string): Promise<ApiResponse<MountedSnapshot>> {
    const req: MountSnapshotRequest = {
      root
    };
    return this.post(`/api/${this.instance}/v1/mounts`, req);
  }

  public getMountedSnapshot(root: string): Promise<ApiResponse<MountedSnapshot>> {
    return this.get(`/api/${this.instance}/v1/mounts/${root}`);
  }
  public unMountSnapshot(root: string): Promise<ApiResponse<unknown>> {
    return this.delete(`/api/${this.instance}/v1/mounts/${root}`);
  }
  public getMountedSnapshots(): Promise<ApiResponse<MountsResponse>> {
    return this.get(`/api/${this.instance}/v1/mounts`);
  }

  // Privates
  private async requestWrapper<T>(requestFunc: () => Promise<T>): Promise<ApiResponse<T>> {
    try {
      const response = await requestFunc();
      return {
        isError: false,
        data: response,
        responseCode: 200
      };
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          this.onAuthRequired();
        }
        return {
          isError: true,
          responseCode: error.response?.status || 500,
          originResponseCode: error.response?.status || 500,
          data: error.response?.data
        };
      } else {
        return {
          isError: true,
          responseCode: 500,
          originResponseCode: 500
        };
      }
    }
  }
  private async get<T>(
    path: string,
    query?: { [key: string]: string },
    auth?: { username: string; password: string }
  ): Promise<ApiResponse<T>> {
    return await this.requestWrapper(async () => {
      const response = await axios({
        method: "GET",
        url: path,
        headers: {
          ...this.defaultHeaders
        },
        auth: auth || this.authInfo,
        params: query
      });
      return response.data;
    });
  }
  private async post<TRequest, TResponse>(
    path: string,
    body?: TRequest,
    query?: QueryParams
  ): Promise<ApiResponse<TResponse>> {
    return await this.requestWrapper(async () => {
      const response = await axios({
        method: "POST",
        url: path,
        headers: this.defaultHeaders,
        data: body,
        params: query,
        auth: this.authInfo
      });
      return response.data;
    });
  }

  private async put<TRequest, TResponse>(
    path: string,
    body?: TRequest,
    query?: QueryParams
  ): Promise<ApiResponse<TResponse>> {
    return await this.requestWrapper(async () => {
      const response = await axios({
        method: "PUT",
        url: path,
        headers: this.defaultHeaders,
        data: body,
        params: query,
        auth: this.authInfo
      });
      return response.data;
    });
  }
  private async delete<T>(path: string, params?: QueryParams): Promise<ApiResponse<T>> {
    return await this.requestWrapper(async () => {
      const response = await axios({
        method: "DELETE",
        url: path,
        headers: this.defaultHeaders,
        params,
        auth: this.authInfo
      });
      return response.data;
    });
  }
}
