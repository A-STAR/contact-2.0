export interface ILookupCurrency {
  id: number;
  code: string;
  name: string;
  shortName: string;
}

export interface ILookupCurrenciesResponse {
  success: boolean;
  currencies: Array<ILookupCurrency>;
}

export interface ILookupLanguage {
  id: number;
  name: string;
  isMain: boolean;
}

export interface ILookupLanguagesResponse {
  success: boolean;
  languages: Array<ILookupLanguage>;
}

export interface ILookupUser {
  id: number;
  name: string;
}

export interface ILookupUsersResponse {
  success: boolean;
  users: Array<ILookupUser>;
}

export interface ILookupRole {
  id: number;
  name: string;
}

export interface ILookupRolesResponse {
  success: boolean;
  roles: Array<ILookupRole>;
}

export interface ILookupState {
  currencies: Array<ILookupCurrency>;
  languages: Array<ILookupLanguage>;
  roles: Array<ILookupRole>;
  users: Array<ILookupUser>;
}
