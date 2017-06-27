import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

export enum ToolbarControlEnum {
  BUTTON,
  CHECKBOX,
  LABEL,
  SELECT,
}

export enum ToolbarActionTypeEnum {
  ADD,
  EDIT,
  CLONE,
  REMOVE,
  REFRESH,
  SEARCH,
  SAVE,
  FORWARD,
  BACKWARD,
}

export interface IToolbarAction {
  activeValue?: any;
  control?: ToolbarControlEnum;
  disabled?: boolean;
  hasLabel?: boolean;
  permission?: string | Array<string>;
  styles?: { width?: string };
  text?: string;
  type?: ToolbarActionTypeEnum;
  value?: any;
  visible?: boolean;
}

export interface IToolbarActionSelectPayload {
  action: IToolbarAction;
  value: ILabeledValue[];
}
