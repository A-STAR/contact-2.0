import { IActionType, IEmployee } from '../actions-log.interface';

export interface IActionsLogFilterRequest {
  actionsTypes: number[]|IActionType[];
  employees: number[]|IEmployee[];
  endDate: Date | string;
  endTime: string;
  startDate: Date | string;
  startTime: string;
}
