import {
  clientDelete,
  clientGet,
  clientPost,
  clientPut,
} from "./clientApiFetch";
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
  TasksSummary,
} from "./types";

export interface IKopiaService {
  getSnapshots(): Promise<ApiResponse<Sources>>;
  startSnapshot(sourceInfo: SourceInfo): any;
  getSnapshot(query: {
    [key: string]: string;
  }): Promise<ApiResponse<Snapshots>>;
  updateDescription(
    snapshotIds: string[],
    description: string
  ): Promise<ApiResponse<Snapshot[]>>;
  addPin(snapshotId: string, pin: string): Promise<ApiResponse<Snapshot[]>>;
  updatePin(
    snapshotId: string,
    currentPin: string,
    pin: string
  ): Promise<ApiResponse<Snapshot[]>>;
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

  getTasksSummary(): Promise<ApiResponse<TasksSummary>>;
  resolvePolicy(
    source: SourceInfo,
    data: ResolvePolicyRequest
  ): Promise<ApiResponse<ResolvedPolicy>>;
  getPreferences(): Promise<ApiResponse<Preferences>>;
  setPreferences(data: Preferences): Promise<ApiResponse<Preferences>>;
  getNotificationProfiles(): Promise<ApiResponse<NotificationProfile[]>>;
  createNotificationProfile(
    profile: NotificationProfile
  ): Promise<ApiResponse<NotificationProfile>>;

  deleteNotificationProfile(profileName: string): Promise<ApiResponse<unknown>>;
  testNotificationProfile(
    profile: NotificationProfile
  ): Promise<ApiResponse<unknown>>;

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
}

export class KopiaService implements IKopiaService {
  private instance: string;
  constructor(instance: string) {
    this.instance = instance;
  }

  public getSnapshots(): Promise<ApiResponse<Sources>> {
    return clientGet(`/api/${this.instance}/v1/sources`);
  }

  public startSnapshot(sourceInfo: SourceInfo) {
    return clientPost(
      `/api/${this.instance}/v1/sources/upload`,
      undefined,
      sourceInfo
    );
  }
  public getSnapshot(query: {
    [key: string]: string;
  }): Promise<ApiResponse<Snapshots>> {
    return clientGet(`/api/${this.instance}/v1/snapshots`, query);
  }
  public updateDescription(
    snapshotIds: string[],
    description: string
  ): Promise<ApiResponse<Snapshot[]>> {
    return clientPost(`/api/${this.instance}/v1/snapshots/edit`, {
      description,
      snapshots: snapshotIds,
    });
  }
  public addPin(
    snapshotId: string,
    pin: string
  ): Promise<ApiResponse<Snapshot[]>> {
    return clientPost(`/api/${this.instance}/v1/snapshots/edit`, {
      addPins: [pin],
      removePins: [],
      snapshots: [snapshotId],
    });
  }
  public updatePin(
    snapshotId: string,
    currentPin: string,
    pin: string
  ): Promise<ApiResponse<Snapshot[]>> {
    return clientPost(`/api/${this.instance}/v1/snapshots/edit`, {
      addPins: [pin],
      removePins: [currentPin],
      snapshots: [snapshotId],
    });
  }
  public removePin(
    snapshotId: string,
    pin: string
  ): Promise<ApiResponse<Snapshot[]>> {
    return clientPost(`/api/${this.instance}/v1/snapshots/edit`, {
      removePins: [pin],
      snapshots: [snapshotId],
    });
  }
  public getObjects(oid: string): Promise<ApiResponse<DirManifest>> {
    return clientGet(`/api/${this.instance}/v1/objects/${oid}`);
  }

  public restore(data: RestoreRequest): Promise<ApiResponse<Task>> {
    return clientPost(`/api/${this.instance}/v1/restore`, data);
  }
  public getTasks(): Promise<ApiResponse<TaskList>> {
    return clientGet(`/api/${this.instance}/v1/tasks`);
  }
  public getTask(taskId: string): Promise<ApiResponse<Task>> {
    return clientGet(`/api/${this.instance}/v1/tasks/${taskId}`);
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
    return clientGet(`/api/${this.instance}/v1/tasks/${taskId}/logs`);
  }
  public getStatus(): Promise<ApiResponse<Status>> {
    return clientGet(`/api/${this.instance}/v1/repo/status`);
  }
  public getPolicies(): Promise<ApiResponse<PoliciesList>> {
    return clientGet(`/api/${this.instance}/v1/policies`);
  }

  public getAlgorithms(): Promise<ApiResponse<AlgorithmsList>> {
    return clientGet(`/api/${this.instance}/v1/repo/algorithms`);
  }
  public getPolicy(source: SourceInfo): Promise<ApiResponse<Policy>> {
    return clientGet(`/api/${this.instance}/v1/policy`, source);
  }
  public savePolicy(
    policy: Policy,
    source: SourceInfo
  ): Promise<ApiResponse<Policy>> {
    return clientPut(`/api/${this.instance}/v1/policy`, policy, source);
  }
  public getTasksSummary(): Promise<ApiResponse<TasksSummary>> {
    return clientGet(`/api/${this.instance}/v1/tasks-summary`);
  }
  public resolvePolicy(
    source: SourceInfo,
    data: ResolvePolicyRequest
  ): Promise<ApiResponse<ResolvedPolicy>> {
    return clientPost(`/api/${this.instance}/v1/policy/resolve`, data, source);
  }
  public getPreferences(): Promise<ApiResponse<Preferences>> {
    return clientGet(`/api/${this.instance}/v1/ui-preferences`);
  }
  public setPreferences(data: Preferences): Promise<ApiResponse<Preferences>> {
    return clientPut(`/api/${this.instance}/v1/ui-preferences`, data);
  }

  public getNotificationProfiles(): Promise<
    ApiResponse<NotificationProfile[]>
  > {
    return clientGet(`/api/${this.instance}/v1/notificationProfiles`);
  }
  public createNotificationProfile(
    profile: NotificationProfile
  ): Promise<ApiResponse<NotificationProfile>> {
    return clientPost(`/api/${this.instance}/v1/notificationProfiles`, profile);
  }
  public deleteNotificationProfile(
    profileName: string
  ): Promise<ApiResponse<unknown>> {
    return clientDelete(
      `/api/${this.instance}/v1/notificationProfiles/${profileName}`
    );
  }
  public testNotificationProfile(
    profile: NotificationProfile
  ): Promise<ApiResponse<unknown>> {
    return clientPost(
      `/api/${this.instance}/v1/testNotificationProfile`,
      profile
    );
  }
  public resolvePath(path: string): Promise<ApiResponse<ResolvePath>> {
    return clientPost(`/api/${this.instance}/v1/paths/resolve`, {
      path,
    });
  }
  public estimateSnapshot(
    data: EstimateSnapshotRequest
  ): Promise<ApiResponse<Task>> {
    return clientPost(`/api/${this.instance}/v1/estimate`, data);
  }
  public createSnapshot(
    data: CreateSnapshotRequest
  ): Promise<ApiResponse<Task>> {
    return clientPost(`/api/${this.instance}/v1/sources`, data);
  }
  public getCurrentUser(): Promise<ApiResponse<CurrentUser>> {
    return clientGet(`/api/${this.instance}/v1/current-user`);
  }
  public repoExists(data: CheckRepoRequest): Promise<ApiResponse<unknown>> {
    return clientPost(`/api/${this.instance}/v1/repo/exists`, data);
  }
  public connectRepo(data: ConnectRepoRequest): Promise<ApiResponse<unknown>> {
    return clientPost(`/api/${this.instance}/v1/repo/connect`, data);
  }
  public createRepo(data: object): Promise<ApiResponse<unknown>> {
    return clientPost(`/api/${this.instance}/v1/repo/create`, data);
  }
  public disconnectRepo(): Promise<ApiResponse<unknown>> {
    return clientPost(`/api/${this.instance}/v1/repo/disconnect`);
  }
  public updateRepoDescription(
    description: string
  ): Promise<ApiResponse<unknown>> {
    return clientPost(`/api/${this.instance}/v1/repo/description`, {
      description,
    });
  }
  public deleteSnapshot(
    data: DeleteSnapshotRequest
  ): Promise<ApiResponse<unknown>> {
    return clientPost(`/api/${this.instance}/v1/snapshots/delete`, data);
  }
}
// const methods = {
//   getSnapshots,
//   getControl,
//   getCurrentUser,
//   deleteSnapshot,
//   connectRepo,
//   createRepo,
//   updateRepoDescription,
//   disconnectRepo,
//   startSnapshot,
//   getSnapshot,
//   estimateSnapshot,
//   createSnapshot,
//   updateDescription,
//   getObjects,
//   addPin,
//   updatePin,
//   removePin,
//   repoExists,
//   restore,
//   getTasks,
//   getStatus,
//   getPolicies,
//   getAlgorithms,
//   getPolicy,
//   resolvePolicy,
//   getTasksSummary,
//   getTask,
//   getTaskLogs,
//   getPreferences,
//   setPreferences,
//   getNotificationProfiles,
//   createNotificationProfile,
//   deleteNotificationProfile,
//   testNotificationProfile,
//   savePolicy,
//   resolvePath,
// };

// export default methods;
