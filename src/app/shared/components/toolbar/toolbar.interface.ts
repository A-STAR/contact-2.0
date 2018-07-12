import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ButtonType } from '@app/shared/components/button/button.interface';

export enum ToolbarItemType {
  BUTTON = 'button',
  CHECKBOX = 'checkbox',
}

export type ToolbarAction = (item?: ToolbarElement) => void;

export interface ToolbarElement {
  action?: ToolbarAction | Action;
  enabled?: Observable<boolean>;
  label?: string;
  // TODO(i.lobanov): move it to some type which would work with IToolbarItem
  closeOnClick?: boolean;
  align?: 'right' | 'left';
  classes?: Observable<string>;
}

export interface ToolbarButton extends ToolbarElement {
  type: ToolbarItemType;
  buttonType: ButtonType;
  icon?: string;
  children?: Array<ToolbarElement>;
}

export interface ToolbarCheckbox extends ToolbarElement {
  type: ToolbarItemType.CHECKBOX;
  state: Observable<boolean>;
}

export type ToolbarItem = ToolbarButton | ToolbarCheckbox;

export interface Toolbar {
  items: Array<ToolbarItem>;
  label?: string;
  // false by default
  suppressCenterZone?: boolean;
  // false by default
  showBorder?: boolean;
}
