import { IAppState } from '../../../core/state/state.interface';

export interface IToolbarItem {
  action: string;
  icon: string;
  label: string;
  permissions: Array<string>;
  disabled: (state: IAppState) => boolean;
}

export interface IToolbar {
  items: Array<IToolbarItem>;
}

export interface IToolbarButton {
  action: string;
  icon: string;
  label: string;
  disabled: boolean;
}
