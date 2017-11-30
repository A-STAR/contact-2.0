import { IFilterControl } from 'app/shared/components/filter-grid/filter-grid.interface';

export interface IFilterGridDef {
  key: string;
  translationKey: string;
  title: string;
  filterDef: string[];
  filterControls?: IFilterControl[];
}
