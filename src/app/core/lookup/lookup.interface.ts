export type ILookupKey = 'contractors' | 'currencies' | 'languages' | 'portfolios' | 'roles' | 'users';

export interface ILookupContractor {
  id: number;
  name: string;
}

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

export interface ILookupPortfolio {
  id: number;
  name: string;
  contractorId: number;
  contractor: string;
}

export interface ILookupRole {
  id: number;
  name: string;
}

export interface ILookupUser {
  id: number;
  name: string;
}

export enum LookupStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}

export interface ILookupSlice<T> {
  data: Array<T>;
  status: LookupStatusEnum;
}

export interface ILookupState {
  contractors: ILookupSlice<ILookupContractor>;
  currencies: ILookupSlice<ILookupCurrency>;
  languages: ILookupSlice<ILookupLanguage>;
  portfolios: ILookupSlice<ILookupPortfolio>;
  roles: ILookupSlice<ILookupRole>;
  users: ILookupSlice<ILookupUser>;
}
