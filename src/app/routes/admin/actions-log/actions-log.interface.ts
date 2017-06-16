import { IGrid2PaginationInfo, IGrid2State } from '../../../shared/components/grid2/grid2.interface';
import { IActionsLogFilterRequest } from './filter/actions-log-filter.interface';

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
  actionsLog: IActionsLogData;
  employees: IEmployee[];
  actionTypes: IActionType[];
  actionsLogGrid?: IGrid2State;
}

export interface IActionsLogPayload {
  type?: any;
  payload?: IActionsLogData|IEmployee[]|IActionType[];
}

export interface IActionsLogData {
  total: number;
  data: IActionLog[];
}

export interface IActionsLogFilterRequestPayload {
  request: IActionsLogFilterRequest;
  pageInfo: IGrid2PaginationInfo;
}

export const toFullName = (entity: { lastName: string, firstName: string, middleName: string }) => {
  return [ entity.lastName, entity.firstName, entity.middleName ].filter((part: string) => !!part).join(' ');
};
