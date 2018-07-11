import { Observable } from 'rxjs/Observable';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';

export type ITitlebarAction = (item?: ITitlebarElement) => void;

export interface ITitlebarElement {
  action?: ITitlebarAction;
  align?: 'right' | 'left';
  classes?: Observable<string>;
  enabled?: Observable<boolean>;
  label?: string;
  children?: ITitlebarElement[];
}

export interface ITitlebarButton extends ITitlebarElement {
  type: ToolbarItemType.BUTTON;
  buttonType?: ButtonType;
  children?: ITitlebarElement[];
  iconCls?: string;
}

export interface ITitlebarCheckbox extends ITitlebarElement {
  type: ToolbarItemType.CHECKBOX;
  state: Observable<boolean>;
}

export type ITitlebarItem = ITitlebarButton | ITitlebarCheckbox;

export interface ITitlebar {
  noBorder?: boolean;
  items?: ITitlebarItem[];
  label?: string;
  // false by default
  suppressCenterZone?: boolean;
  suppressBorder?: boolean;
}
