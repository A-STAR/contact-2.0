import { IUserTerm } from '../../../core/user/dictionaries/user-dictionaries.interface';

export interface IEmployee {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  position: string;
  organization: string;
  isInactive: number;
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
  employees: IEmployee[];
  actionTypes: IUserTerm[];
}

export interface IActionsLogPayload {
  type?: any;
  payload?: IEmployee[]|IUserTerm[];
}
