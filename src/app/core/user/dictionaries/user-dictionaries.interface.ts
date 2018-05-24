import { IOption } from '@app/core/converter/value-converter.interface';

export interface IUserTerm {
  code: number;
  name: string;
  isClosed: 0 | 1;
  parentDictTerm: number;
  parentCode: number;
}

export type TUserDictionary = IUserTerm[];

export interface IUserDictionaryOptions {
  [key: number]: IOption[];
}

export interface IUserDictionaries {
  [key: number]: TUserDictionary;
}

export interface IUserDictionariesState {
  [key: number]: TUserDictionary;
}

export interface IUserDictionaryAction {
  dictionaryId: number;
  terms?: IUserTerm[];
}

export type ITransformCallback<T> = (term: IUserTerm) => T;

export interface ITypeCodeItem {
  typeCode: number;
}
