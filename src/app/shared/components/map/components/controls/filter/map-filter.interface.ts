import {
  IMapToolbarFilterItem,
} from '@app/shared/components/map/components/controls/toolbar/map-toolbar.interface';
import { IMultiSelectOption } from '@app/shared/components/form/select/select.interface';

export enum MapFilters {
  TOGGLE_ALL = 1,
  RESET,
  TOGGLE_INACTIVE,
  ADDRESS_TYPE,
  VISIT_STATUS,
  ADDRESS_STATUS,
  CONTACT_TYPE,
  TOGGLE_ADDRESSES,
  TOGGLE_ACCURACY,
  DISTANCE,
}

export interface IMapFilterItemAction {
  value: any;
  item: IMapToolbarFilterItem;
}

export interface IMapFilterMultiSelectOptions {
  [key: number]: number[] | boolean;
}
