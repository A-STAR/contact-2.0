import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

export interface IDebtAttributeChange {
  portfolioId?: number;
  creditTypeCode?: number;
  regionCode?: number;
  branchCode?: number;
  timeZoneId?: number;
  dict1Code?: number;
  dict2Code?: number;
  dict3Code?: number;
  dict4Code?: number;
}

export const DictOperation = {
  [UserDictionariesService.DICTIONARY_BRANCHES]: 'branchCode',
  [UserDictionariesService.DICTIONARY_PRODUCT_TYPE]: 'creditTypeCode',
  [UserDictionariesService.DICTIONARY_REGIONS]: 'regionCode',
  [UserDictionariesService.DICTIONARY_DEBT_LIST_1]: 'dict1Code',
  [UserDictionariesService.DICTIONARY_DEBT_LIST_2]: 'dict2Code',
  [UserDictionariesService.DICTIONARY_DEBT_LIST_3]: 'dict3Code',
  [UserDictionariesService.DICTIONARY_DEBT_LIST_4]: 'dict4Code',
};
