import { UserDictionariesService } from '../user/dictionaries/user-dictionaries.service';

interface IValue {
  dictNameCode: number;
  typeCode: number;
  valueN: number;
  valueB: number;
  valueS: string;
  valueD: string;
}

export const TYPE_CODES = {
  NUMBER:   1,
  DATE:     2,
  STRING:   3,
  BOOLEAN:  4,
  FLOAT:    5,
  DICT:     6,
  DATETIME: 7,
};

export const getRawValue = <T extends IValue>(value: T): number | string => {
  switch (value.typeCode) {
    case TYPE_CODES.NUMBER:
    case TYPE_CODES.FLOAT:
    case TYPE_CODES.DICT:
      return value.valueN;
    case TYPE_CODES.DATE:
    case TYPE_CODES.DATETIME:
      return value.valueD;
    case TYPE_CODES.STRING:
      return value.valueS;
    case TYPE_CODES.BOOLEAN:
      return value.valueB;
  };
}

export const getDictCodeForValue = <T extends IValue>(value: T): number => {
  return value.typeCode === TYPE_CODES.BOOLEAN
    ? UserDictionariesService.DICTIONARY_BOOLEAN_TYPE
    : value.dictNameCode;
}
