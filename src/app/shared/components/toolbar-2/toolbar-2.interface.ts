import { Action } from '@ngrx/store';

import { IAppState } from '../../../core/state/state.interface';

export enum ToolbarToolbarItemTypeEnum {
  BUTTON,
  CHECKBOX
}

export type IToolbarActionCreator = () => void;

export interface IToolbarElement {
  action: IToolbarActionCreator | Action;
  label: string;
  permissions?: Array<string>;
  disabled?: (state: IAppState) => boolean;
}

export interface IToolbarButton extends IToolbarElement {
  type: ToolbarToolbarItemTypeEnum.BUTTON;
  icon: string;
}

export interface IToolbarCheckbox extends IToolbarElement {
  type: ToolbarToolbarItemTypeEnum.CHECKBOX;
  state: (state: IAppState) => boolean;
}

export type IToolbarItem = IToolbarButton | IToolbarCheckbox;

export interface IToolbar {
  items: Array<IToolbarItem>;
}
