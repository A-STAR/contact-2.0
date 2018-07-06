import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ButtonType } from '@app/shared/components/button/button.interface';

export enum ToolbarItemType {
  BUTTON,
  CHECKBOX,
}

export type IToolbarAction = () => void;

export interface IToolbarElement {
  action?: IToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
  align?: 'right';
  // TODO(i.lobanov): move it to some type which would work with IToolbarItem
  closeOnClick?: boolean;
}

export interface IToolbarButton extends IToolbarElement {
  type: ToolbarItemType;
  buttonType: ButtonType;
  icon?: string;
  children?: Array<IToolbarElement>;
}

export interface IToolbarCheckbox extends IToolbarElement {
  type: ToolbarItemType.CHECKBOX;
  state: Observable<boolean>;
}

export type IToolbarItem = IToolbarButton | IToolbarCheckbox;

export interface IToolbar {
  items: Array<IToolbarItem>;
}
