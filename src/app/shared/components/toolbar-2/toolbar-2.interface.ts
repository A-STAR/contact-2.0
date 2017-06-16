import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export enum ToolbarItemTypeEnum {
  BUTTON,
  BUTTON_ADD,
  BUTTON_DELETE,
  BUTTON_EDIT,
  BUTTON_REFRESH,
  CHECKBOX,
}

export type IToolbarActionCreator = () => void;

export interface IToolbarDefaultElement {
  icon: string;
  label: string;
}

export interface IToolbarElement {
  action: IToolbarActionCreator | Action;
  disabled?: Observable<boolean>;
  label?: string;
  // permissions?: Array<string>;
}

export interface IToolbarButton extends IToolbarElement {
  icon?: string;
  type: ToolbarItemTypeEnum;
}

export interface IToolbarCheckbox extends IToolbarElement {
  type: ToolbarItemTypeEnum.CHECKBOX;
  state: Observable<boolean>;
}

export type IToolbarItem = IToolbarButton | IToolbarCheckbox;

export interface IToolbar {
  items: Array<IToolbarItem>;
}
