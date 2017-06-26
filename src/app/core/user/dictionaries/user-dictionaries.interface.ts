export interface IUserTerm {
  code: number;
  name: string;
  isClosed: boolean;
}

export interface IUserTermsResponse {
  success: boolean;
  userTerms: Array<IUserTerm>;
}

export interface IDictionary {
  terms: {
    [key: number]: IUserTerm;
  };
  isResolved: boolean;
}

export interface IUserDictionariesState {
  dictionaries: {
    [key: number]: IDictionary;
  };
}
