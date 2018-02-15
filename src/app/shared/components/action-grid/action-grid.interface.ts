import { MetadataActionType } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

export interface IActionGridDialogFilterParams {
  filtering: FilterObject;
  gridName: string;
  columnNames: string[];
}

export interface ISingleSelection {
  data: { [key: string]: any };
  type: MetadataActionType;
}

export interface IAddOption {
  name: string;
  value: (string | number)[];
}

export interface IActionGridDialogData {
  addOptions: IAddOption[];
  params: string[];
  selection: number[][];
}

export interface ICloseAction {
  refresh?: boolean;
  deselectAll?: boolean;
}

export interface ISelectionIds {
  data: number[][];
  type: MetadataActionType;
}

export interface ISelectionFilter {
  data: IActionGridDialogFilterParams;
  type: MetadataActionType;
}

export type IGridActionPayload = ISelectionIds | ISelectionFilter | ISingleSelection;

export interface IGridActionParams {
  addOptions: IAddOption[];
  payload: IGridActionPayload;
}
