import { IEmployee } from '../actions-log.interface';
import { IDictionaryItem } from '../../../../core/dictionaries/dictionaries.interface';
import { IGrid2Filter } from '../../../../shared/components/grid2/grid2.interface';

export interface IActionsLogFilterRequest {
  actionsTypes: number[]|IDictionaryItem[];
  currentPage?: number;
  employees: number[]|IEmployee[];
  endDate: Date | string;
  endTime: string;
  gridFilters?: IGrid2Filter[];
  startDate: Date | string;
  startTime: string;
}
