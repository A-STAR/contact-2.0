import { ILabeledValue } from '../converter/value-converter.interface';

export type IDictionaryValue = number | Array<ILabeledValue>;

export interface IDictionaryItem {
  code: number;
  name: string;
}

export interface ITypeCodeItem {
  typeCode: number;
}

export interface IDictionary {
  id: number;
  code: number;
  name: string;
  translatedName: string;
  nameTranslations: Array<ILabeledValue>;
  parentCode: IDictionaryValue;
  typeCode: IDictionaryValue;
  termTypeCode: IDictionaryValue;
}

export interface ITerm {
  id: number;
  code: number;
  name: string;
  translatedName: string;
  nameTranslations: Array<ILabeledValue>;
  typeCode: IDictionaryValue;
  parentCode: IDictionaryValue;
  parentCodeName: string;
  isClosed: number;
}

export enum DictionariesDialogActionEnum {
  DICTIONARY_ADD,
  DICTIONARY_EDIT,
  DICTIONARY_REMOVE,
  TERM_ADD,
  TERM_EDIT,
  TERM_REMOVE,
}

export interface IDictionariesState {
  dictionaries: Array<IDictionary>;
  selectedDictionary: IDictionary;
  selectedTerm: ITerm;
  terms: Array<ITerm>;
  dictionaryTermTypes: Array<ITerm>;
  dialogAction: DictionariesDialogActionEnum;
}
