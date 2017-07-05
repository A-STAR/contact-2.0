import { ILabeledValue } from '../converter/value/value-converter.interface';

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
  code: string;
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
  terms: Array<ITerm>;
  dictionaryTermTypes: Array<ITerm>;
  selectedTermId: number;
  dialogAction: DictionariesDialogActionEnum;
}
