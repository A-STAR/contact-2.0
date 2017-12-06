import { ILabeledValue } from '../../../../core/converter/value-converter.interface';

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
  GO_FORWARD,
  GO_BACKWARD,
  GO_FIRST,
  GO_LAST,
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

export interface IToolbarActionSelect {
  action: IToolbarAction;
  value: ILabeledValue[];
}
