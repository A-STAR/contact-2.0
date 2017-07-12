export interface IUserTerm {
  code: number;
  name: string;
  isClosed: boolean;
}

export interface IUserTermsResponse {
  success: boolean;
  userTerms: Array<IUserTerm>;
}

export interface IUserDictionary {
  [key: number]: IUserTerm;
}

export interface IUserDictionariesState {
  dictionaries: {
    [key: number]: Array<IUserTerm>;
  };
}
