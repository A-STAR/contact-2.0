import { Type } from '@angular/core';

export interface IEntityDef {
  entityClass: Type<any>;
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
    entityName: string;
    params: Record<string, any>;
    serializedParams: string;
  };
}

export interface IRepositoryFetchSuccessAction extends IRepositoryGenericAction {
  type: RepositoryActionType.FETCH_SUCCESS;
  payload: {
    entityName: string;
    data: any[];
    primaryKey: string;
    serializedParams: string;
  };
}

export type IRepositoryAction =
  | IRepositoryFetchAction
  | IRepositoryFetchSuccessAction
;
