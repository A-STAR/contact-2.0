import { ILabeledValue } from '../converter/value/value-converter.interface';

export type IDictionaryValue = number | Array<ILabeledValue>;

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
  selectedDictionaryCode: string;
  terms: Array<ITerm>;
  terms5: Array<ITerm>;
  selectedTermId: number;
  dialogAction: DictionariesDialogActionEnum;
}

export interface IEntityTranslation {
  languageId: number;
  value: string;
  isMain?: number;
}
