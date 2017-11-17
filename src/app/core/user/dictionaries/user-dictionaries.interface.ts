export interface IUserTerm {
  code: number;
  name: string;
  isClosed: boolean;
  parentDictTerm: number;
  parentCode: number;
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

export interface IUserDictionaryAction {
  dictionaryId: number;
  terms?: IUserTerm[];
}

export type ITransformCallback<T> = (dictionary: IUserTerm) => T;

export interface ITypeCodeItem {
  typeCode: number;
}
