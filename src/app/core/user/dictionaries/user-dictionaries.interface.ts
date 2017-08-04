export interface IUserTerm {
  code: number;
  name: string;
  isClosed: boolean;
}

export interface IUserTermsResponse {
  success: boolean;
  userTerms: IUserTerm[];
}

export interface IUserDictionary {
  [key: number]: IUserTerm;
}

export interface IUserDictionaries {
  [key: number]: IUserTerm[];
}

export interface IUserDictionariesState {
  dictionaries: {
    [key: number]: IUserTerm[];
  };
}

export type ITransformCallback<T> = (dictionary: IUserTerm) => T
