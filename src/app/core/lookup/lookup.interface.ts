export type ILookupKey =
  'attributeTypes' |
  'contractors' |
  'currencies' |
  'dictionaries' |
  'languages' |
  'portfolios' |
  'roles' |
  'users';

export interface ILookupBase {
  id: number;
  name: string;
}

export interface ILookupAttributeType extends ILookupBase {
  code: number;
  disabledValue: boolean;
  sortOrder: number;
  typeCode: number;
  children: ILookupAttributeType[];
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
  attributeTypes: ILookupSlice<ILookupAttributeType>;
  contractors: ILookupSlice<ILookupContractor>;
  currencies: ILookupSlice<ILookupCurrency>;
  dictionaries: ILookupSlice<ILookupDictionary>;
  languages: ILookupSlice<ILookupLanguage>;
  portfolios: ILookupSlice<ILookupPortfolio>;
  roles: ILookupSlice<ILookupRole>;
  users: ILookupSlice<ILookupUser>;
}
