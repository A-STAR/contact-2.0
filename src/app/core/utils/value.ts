import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IValueEntity } from '@app/core/converter/value-converter.interface';

import { UserDictionariesService } from '../user/dictionaries/user-dictionaries.service';

export interface IValue extends IValueEntity {
  dictNameCode?: number;
}

export enum TYPE_CODES {
  NUMBER   = 1,
  DATE     = 2,
  STRING   = 3,
  BOOLEAN  = 4,
  FLOAT    = 5,
  DICT     = 6,
  DATETIME = 7
}

export const getRawValue = <T extends IValue>(value: T, valueTypeKey: string = 'typeCode'): number | string => {
  switch (value[valueTypeKey]) {
    case TYPE_CODES.NUMBER:
    case TYPE_CODES.FLOAT:
    case TYPE_CODES.DICT:
      return value.valueN;
    case TYPE_CODES.DATE:
    case TYPE_CODES.DATETIME:
      return value.valueD;
    case TYPE_CODES.STRING:
      return value.valueS;
    // TODO(d.maltsev): maybe this should be boolean or at least number?
    case TYPE_CODES.BOOLEAN:
      return String(value.valueB);
    default:
      return null;
  }
};

export const getDictCodeForValue = <T extends IValue>(value: T): number => {
  return value.typeCode === TYPE_CODES.BOOLEAN
    ? UserDictionariesService.DICTIONARY_BOOLEAN_TYPE
    : value.dictNameCode;
};

export const getFormControlConfig = <T extends IValue>(value: T): Partial<IDynamicFormControl> => {
  switch (value.typeCode) {
    case TYPE_CODES.NUMBER:
    case TYPE_CODES.FLOAT:
      return { type: 'number' };
    case TYPE_CODES.DICT:
      return { type: 'select' };
    case TYPE_CODES.DATE:
      return { type: 'datepicker' };
    case TYPE_CODES.DATETIME:
      return { type: 'datetimepicker' };
    case TYPE_CODES.STRING:
      return { type: 'text' };
    case TYPE_CODES.BOOLEAN:
      // TODO(d.maltsev): double check that boolean type uses corresponding dictionary
      return { type: 'boolean' };
    default:
      return null;
  }
};

export const getValue = (typeCode: number, value: string | number): Partial<IValue> => {
  switch (typeCode) {
    case TYPE_CODES.NUMBER:
    case TYPE_CODES.FLOAT:
    case TYPE_CODES.DICT:
      return { valueN: value as number };
    case TYPE_CODES.DATE:
    case TYPE_CODES.DATETIME:
      return { valueD: value as string };
    case TYPE_CODES.STRING:
      return { valueS: value as string };
    case TYPE_CODES.BOOLEAN:
      return { valueB: value as number };
    default:
      return null;
  }
};
