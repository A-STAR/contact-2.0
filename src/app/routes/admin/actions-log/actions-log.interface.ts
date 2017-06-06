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
}

export interface IActionsLogPayload {
  type?: any;
  payload?: IActionLog[]|IEmployee[]|IActionType[];
}
