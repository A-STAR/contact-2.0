import { IFilterControl } from 'app/shared/components/filter-grid/filter-grid.interface';

export interface IGridDef {
  key: string;
  translationKey: string;
  title: string;
  filterControls?: IFilterControl[];
}
