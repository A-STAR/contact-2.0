import { FilterObject } from '../../../../shared/components/grid2/filter/grid2-filter';

export interface IActionsLogFilterRequest {
  filters: FilterObject;
  currentPage?: number;
}
