import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { MapFilters } from '@app/shared/components/map/components/controls/filter/map-filter.interface';
import { Map } from 'leaflet';

export enum MapToolbarItemType {
  FILTER = 'filter',
  BUTTON = 'button',
  SEPARATOR = 'separator',
  CHECKBOX = 'checkbox',
  DICTIONARY = 'dict',
  LOOKUP = 'lookup',
  SLIDER = 'slider',
}

export interface IMapToolbarActionData {
  item: IMapToolbarItem;
  value: any;
  map: google.maps.Map | Map;
}

export type IMapToolbarAction = (data: IMapToolbarActionData) => void;

export interface IMapToolbarItem {
  type: MapToolbarItemType;
  action?: IMapToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
  icon?: string;
  children?: Array<IMapToolbarItem | IMapToolbarFilterItem>;
}

export interface IMapToolbarFilterItem extends IMapToolbarItem {
  filter?: MapFilters;
  dictCode?: number;
  lookupKey?: string;
  preserveOnClick?: boolean;
  multi?: boolean;
  value?: any;
  showInput?: boolean;
}
