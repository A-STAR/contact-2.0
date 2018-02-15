import { IAGridFilterRequest } from '@app/shared/components/grid2/grid2.interface';

export interface IActionGridDialogNodeParams {
  [key: string]: number | string;
}

export interface IActionGridDialogSelectionParams {
  [key: string]: Array<number | string>;
}

export interface IAddOption {
  name: string;
  value: (string | number)[];
}

export interface IActionGridDialogData {
  addOptions: IAddOption[];
  params: IActionGridDialogNodeParams;
  selection: IActionGridDialogSelectionParams;
}

export interface ICloseAction {
  refresh?: boolean;
  deselectAll?: boolean;
}

export enum ActionGridPayloadType {
  SELECTION,
  FILTER
}

export interface ISelectionIds {
  data: IActionGridDialogSelectionParams;
  type: ActionGridPayloadType;
}

export interface ISelectionFilter {
  data: IAGridFilterRequest;
  type: ActionGridPayloadType;
}

type IGridActionPayload = ISelectionIds | ISelectionFilter;

export interface IGridActionParams<T> {
  addOptions: IAddOption[];
  payload?: IGridActionPayload;
  current: T;
}
