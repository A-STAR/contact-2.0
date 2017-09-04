import { IUserDictionary } from '../../../core/user/dictionaries/user-dictionaries.interface';

export interface IEmployee {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  position: string;
  organization: string;
  isBlocked: number;
}

export interface IActionLog {
  createDateTime: string;
  dsc: string;
  firstName: string;
  guiObject: string;
  lastName: string;
  machine: string;
  middleName: string;
  personId: number;
  position: string;
  typeCode: number;
  userId: number;
}

export interface IActionsLogState {
  actionsLog: IActionsLogData;
  employees: IEmployee[];
  actionTypes: IUserDictionary;
}

export interface IActionsLogPayload {
  type?: any;
  payload?: IActionsLogData|IEmployee[]|IUserDictionary;
}

export interface IActionsLogData {
  total: number;
  data: IActionLog[];
}
