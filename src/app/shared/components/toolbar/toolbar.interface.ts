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
  text?: string;
  hasLabel?: boolean;
  type?: ToolbarActionTypeEnum;
  visible?: boolean;
  permission?: string | Array<string>;
  control?: ToolbarControlEnum;
  value?: any;
  activeValue?: any;
  noRender?: boolean;
  styles?: { width?: string };
}
export interface IToolbarActionSelectPayload {
  action: IToolbarAction;
  value: ILabeledValue;
}
