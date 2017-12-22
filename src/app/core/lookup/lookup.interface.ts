export type ILookupKey =
  'contractors' |
  'currencies' |
  'dictionaries' |
  'languages' |
  'portfolios' |
  'roles' |
  'timezone' |
  'users';

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

export interface ILookupDictionary extends ILookupBase {
  code: number;
  name: string;
}

export interface ILookupLanguage extends ILookupBase {
  isMain: boolean;
}

export interface ILookupPortfolio extends ILookupBase {
  contractorId: number;
  contractor: string;
}

export interface ILookupTimeZone extends ILookupBase {
  code: string;
  utcOffset: string;
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
  dictionaries: ILookupSlice<ILookupDictionary>;
  languages: ILookupSlice<ILookupLanguage>;
  portfolios: ILookupSlice<ILookupPortfolio>;
  roles: ILookupSlice<ILookupRole>;
  // note, that this key is in singular form, because route is GET lookup/timeZone
  timezone: ILookupSlice<ILookupTimeZone>;
  users: ILookupSlice<ILookupUser>;
}
