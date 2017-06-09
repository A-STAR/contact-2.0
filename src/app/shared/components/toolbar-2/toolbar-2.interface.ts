import { Action } from '@ngrx/store';

import { IAppState } from '../../../core/state/state.interface';

export enum ToolbarItemTypeEnum {
  BUTTON,
  BUUTON_ADD,
  BUTTON_EDIT,
  BUTTON_DELETE,
  BUTTON_REFRESH,
  CHECKBOX,
}

export type IToolbarActionCreator = () => void;

export interface IToolbarElement {
  action: IToolbarActionCreator | Action;
  label?: string;
  permissions?: Array<string>;
  disabled?: (state: IAppState) => boolean;
}

export interface IToolbarButton extends IToolbarElement {
  type: ToolbarItemTypeEnum.BUTTON;
  icon?: string;
}

export interface IToolbarCheckbox extends IToolbarElement {
  type: ToolbarItemTypeEnum.CHECKBOX;
  state: (state: IAppState) => boolean;
}

export type IToolbarItem = IToolbarButton | IToolbarCheckbox;

export interface IToolbar {
  items: Array<IToolbarItem>;
}
