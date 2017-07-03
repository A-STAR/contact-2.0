import { IEmployee } from '../actions-log.interface';
import { IDictionaryItem } from '../../../../core/dictionaries/dictionaries.interface';

export interface IActionsLogFilterRequest {
  actionsTypes: number[]|IDictionaryItem[];
  employees: number[]|IEmployee[];
  endDate: Date | string;
  endTime: string;
  startDate: Date | string;
  startTime: string;
}
