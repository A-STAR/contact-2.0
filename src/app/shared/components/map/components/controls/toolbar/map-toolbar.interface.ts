import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export enum MapToolbarItemType {
  FILTER = 'filter'
}

export enum MapToolbarFilterItemType {
  BUTTON = 'button',
  SEPARATOR = 'separator',
  CHECKBOX = 'checkbox',
  DICTIONARY = 'dict',
  LOOKUP = 'lookup'
}

export type IMapToolbarAction = (map: any) => void;

export interface IMapToolbarElement {
  action?: IMapToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
}

export interface IMapToolbarButton extends IMapToolbarElement {
  type: MapToolbarItemType;
  icon?: string;
  children?: Array<IMapToolbarElement>;
}

export interface IMapToolbarFilter {
  type: MapToolbarItemType;
  icon?: string;
  enabled?: Observable<boolean>;
  children?: Array<IMapToolbarFilterItem>;
}

export interface IMapToolbarFilterItem {
  type: MapToolbarFilterItemType;
  action?: IMapToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
  icon?: string;
}

export type IMapToolbarItem = IMapToolbarButton | IMapToolbarFilter;
