export type ILookupKey = 'contractors' | 'currencies' | 'languages' | 'portfolios' | 'roles' | 'users';

export interface ILookupBase {
  id: number;
  name: string;
}

export type ILookupContractor = ILookupBase;

export type ILookupRole = ILookupBase;

export type ILookupUser = ILookupBase;

export interface ILookupCurrency extends ILookupBase {
  code: string;
  shortName: string;
}

export interface ILookupLanguage extends ILookupBase {
  isMain: boolean;
}

export interface ILookupPortfolio extends ILookupBase {
  contractorId: number;
  contractor: string;
}

export enum LookupStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}

export interface ILookupSlice<T> {
  data?: Array<T>;
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
