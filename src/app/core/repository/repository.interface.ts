export interface IEntityDef {
  entityKey: string;
  primaryKey: string;
  urls: string[];
}

export enum RepositoryStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR   = 'error',
}

export interface IRepositoryState {
  // Entity Name
  [key: string]: {
    data: {
      // Record Primary Key
      [key: number]: any;
    };
    index: {
      // Serialized Params
      [key: string]: {
        primaryKeys: number[];
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
    primaryKey: string;
    serializedParams: string;
  };
}

export type IRepositoryAction =
  | IRepositoryFetchAction
  | IRepositoryFetchSuccessAction
;
