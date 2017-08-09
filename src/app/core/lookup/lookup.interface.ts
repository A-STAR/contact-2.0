export type ILookupKey = 'currencies' | 'languages' | 'roles' | 'users';

export interface ILookupCurrency {
  id: number;
  code: string;
  name: string;
  shortName: string;
}

export interface ILookupLanguage {
  id: number;
  name: string;
  isMain: boolean;
}

export interface ILookupUser {
  id: number;
  name: string;
}

export interface ILookupRole {
  id: number;
  name: string;
}

export enum LookupStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}

export interface ILookupState {
  currencies: {
    data: Array<ILookupCurrency>;
    status: LookupStatusEnum;
  };
  languages: {
    data: Array<ILookupLanguage>;
    status: LookupStatusEnum;
  };
  roles: {
    data: Array<ILookupRole>;
    status: LookupStatusEnum;
  };
  users: {
    data: Array<ILookupUser>;
    status: LookupStatusEnum;
  };
}
