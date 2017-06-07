import { ILabeledValue } from '../converter/value/value-converter.interface';

export interface IDictionary {
  id: number;
  code: string;
  name: string;
  translatedName: string;
  nameTranslations: Array<ILabeledValue>;
  parentCode: number|Array<ILabeledValue>;
  typeCode: number|Array<ILabeledValue>;
  termTypeCode: number|Array<ILabeledValue>;
}

export interface ITerm {
  id: number;
  // TODO
}

// TODO
export type IDictionaryCreateRequest = any;

// TODO
export type IDictionaryUpdateRequest = any;

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
  selectedTermId: number;
  dialogAction: DictionariesDialogActionEnum;
}

export class EntityTranslationsConstants {
  static SPEC_DICT_NAME = 3;
  static SPEC_TERM_NAME = 12;
}

export interface IEntityTranslation {
  languageId: number;
  value: string;
  isMain?: number;
}
