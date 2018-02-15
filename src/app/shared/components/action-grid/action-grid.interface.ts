import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

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

export interface ISelectionIds {
  data: IActionGridDialogSelectionParams;
  type: MetadataActionType;
}

export interface ISelectionFilter {
  data: { filter: FilterObject, gridName: string };
  type: MetadataActionType;
}

export type IGridActionPayload = ISelectionIds | ISelectionFilter;

export interface IGridActionParams {
  addOptions: IAddOption[];
  payload?: IGridActionPayload;
  current: IActionGridDialogNodeParams;
}
