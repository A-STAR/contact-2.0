import { ILabeledValue } from '../../../core/converter/value-converter.interface';
import { IEntityTranslation } from '../../../core/entity/translations/entity-translations.interface';

export type IDictionaryValue = number | ILabeledValue[];

export interface IDictionaryItem {
  code: number;
  name: string;
}

export interface IDictionary {
  id: number;
  code: number;
  name: IEntityTranslation[];
  parentCode: IDictionaryValue;
  typeCode: IDictionaryValue;
  termTypeCode: IDictionaryValue;
}

export interface ITerm {
  id: number;
  code: number;
  name: string;
  translatedName: string;
  nameTranslations: ILabeledValue[];
  typeCode: IDictionaryValue;
  parentCode: IDictionaryValue;
  parentCodeName: string;
  isClosed: number;
}

export enum DictionariesDialogActionEnum {
  TERM_ADD,
  TERM_EDIT,
  TERM_REMOVE,
}

export interface IDictionariesState {
  dictionaries: IDictionary[];
  selectedDictionary: IDictionary;
  selectedTerm: ITerm;
  terms: ITerm[];
  parentTerms: ITerm[];
  dictionaryTermTypes: ITerm[];
  dialogAction: DictionariesDialogActionEnum;
}
