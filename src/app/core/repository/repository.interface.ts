export interface IEntityDef {
  entityKey: string;
  urls: string[];
}

export enum RepositoryStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR   = 'error',
}

export interface IRepositoryState {
  // Entity ID
  [key: string]: {
    data: {
      // Record ID
      [key: number]: any;
    };
    index: {
      // Serialized Params
      [key: string]: {
        ids: number[];
        status: RepositoryStatus;
      };
    };
  };
}

export enum RepositoryActionType {
  FETCH         = '[repository] fetch',
  FETCH_SUCCESS = '[repository] fetch success',
}

export interface IRepositoryGenericAction {
  type: RepositoryActionType;
}

export interface IRepositoryFetchAction extends IRepositoryGenericAction {
  type: RepositoryActionType.FETCH;
  payload: {
    entityKey: string;
    params: Record<string, any>;
  };
}

export interface IRepositoryFetchSuccessAction extends IRepositoryGenericAction {
  type: RepositoryActionType.FETCH_SUCCESS;
  payload: {
    entityKey: string;
    data: any[];
    serializedParams: string;
  };
}

export type IRepositoryAction =
  | IRepositoryFetchAction
  | IRepositoryFetchSuccessAction
;
