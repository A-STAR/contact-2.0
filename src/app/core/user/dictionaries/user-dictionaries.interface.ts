export interface IUserTerm {
  code: number;
  name: string;
  isClosed: boolean;
  parentDictTerm: number;
  parentCode: number;
}

export type TUserDictionary = IUserTerm[];

export interface IUserDictionaries {
  [key: number]: TUserDictionary;
}

export interface IUserDictionariesState {
  dictionaries: {
    [key: number]: TUserDictionary;
  };
}

export interface IUserDictionaryAction {
  dictionaryId: number;
  terms?: IUserTerm[];
}

export type ITransformCallback<T> = (term: IUserTerm) => T;

export interface ITypeCodeItem {
  typeCode: number;
}
