import { IGrid2State } from '../../../shared/components/grid2/grid2.interface';
import { IDictionaryItem } from '../../../core/dictionaries/dictionaries.interface';

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

export interface IActionsLogServiceState {
  actionsLog: IActionsLogData;
  employees: IEmployee[];
  actionTypes: IDictionaryItem[];
  actionsLogGrid: IGrid2State;
}

export interface IActionsLogPayload {
  type?: any;
  payload?: IActionsLogData|IEmployee[]|IDictionaryItem[];
}

export interface IActionsLogData {
  total: number;
  data: IActionLog[];
}
