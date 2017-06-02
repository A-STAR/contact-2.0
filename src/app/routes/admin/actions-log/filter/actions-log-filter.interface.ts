import { IActionType, IEmployee } from '../actions-log.interface';

export interface IActionsLogFilterRequest {
  actionsTypes: number[]|IActionType[];
  employees: number[]|IEmployee[];
  endDate: string;
  endTime: string;
  startDate: string;
  startTime: string;
}
