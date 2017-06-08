import { IGrid2State } from '../../../shared/components/grid2/grid2.interface';

export interface IEmployee {
  id: number;
  lastName: string;
  firstName: string;
  middleName: string;
  position: string;
  organization: string;
  isBlocked: number;
}

export interface IActionType {
  code: number;
  name: string;
}

export interface IActionLog {
  userId: number;
  lastName: string;
  firstName: string;
  middleName: string;
  position: string;
  typeCode: number;
  createDateTime: string;
  machine: string;
  guiObject: string;
  dsc: string;
  personId: number;
}

export interface IActionsLogServiceState {
  actionsLog: IActionLog[];
  employees: IEmployee[];
  actionTypes: IActionType[];
  actionsLogGrid?: IGrid2State;
}

export interface IActionsLogPayload {
  type?: any;
  payload?: IActionLog[]|IEmployee[]|IActionType[];
}

export const toFullName = (entity: { lastName: string, firstName: string, middleName: string }) => {
  return [ entity.lastName, entity.firstName, entity.middleName ].filter((part: string) => !!part).join(' ');
};
