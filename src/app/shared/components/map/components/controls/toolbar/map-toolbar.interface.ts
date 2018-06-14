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
  item: IMapToolbarElement;
  value: any;
  map: google.maps.Map | Map;
}

export type IMapToolbarAction = (data: IMapToolbarActionData) => void;

export interface IMapToolbarElement {
  type: MapToolbarItemType;
  action?: IMapToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
}

export interface IMapToolbarButton extends IMapToolbarElement {
  children?: Array<IMapToolbarElement>;
}

export interface IMapToolbarFilter {
  children?: Array<IMapToolbarFilterItem>;
}

export type IMapFilterFn = (entity: any, params?: any) => boolean;

export interface IMapToolbarFilterItem {
  type: MapToolbarItemType;
  filter?: IMapFilterFn | MapFilters;
  action?: IMapToolbarAction | Action;
  enabled?: Observable<boolean>;
  dictCode?: number;
  lookupKey?: string;
  checked?: boolean;
  preserveOnClick?: boolean;
  label?: string;
  icon?: string;
  multi?: boolean;
  value?: any;
  showInput?: boolean;
}

export type IMapToolbarItem = IMapToolbarButton | IMapToolbarFilter;
