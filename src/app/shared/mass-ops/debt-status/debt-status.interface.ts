import { IUserConstant } from '@app/core/user/constants/user-constants.interface';
import { IUserDictionaries } from '@app/core/user/dictionaries/user-dictionaries.interface';

export interface IDebtStatusChangeParams {
  statusCode: number;
  reasonCode?: number;
  comment?: string;
}

export interface IDebtStatusDictionaries extends IUserDictionaries {
    constant: IUserConstant;
}
