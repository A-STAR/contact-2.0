import { MetadataActionType, IMetadataAction, IMetadataActionParam } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

export interface IGridActionPayload {
  data: IGridActionData;
  type: MetadataActionType;
}

export interface IGridActionFilterSelection {
  filtering: FilterObject;
  gridName: string;
  columnNames: string[];
}

export interface IGridActionSingleSelection {
  [key: string]: any;
}

export type IGridActionSelection = number[][];

export interface IAddOption {
  name: string;
  value: (string | number)[];
}

export type IGridActionData = IGridActionSingleSelection | IGridActionSelection | IGridActionFilterSelection;

export interface ICloseAction {
  refresh?: boolean;
  deselectAll?: boolean;
  metadataAction?: IGridAction;
}

export interface IActionGridAction {
  metadataAction: IMetadataAction;
  // selected row data
  selection: any;
}

export interface IGridActionContext {
  metadataKey?: string;
  filters?: FilterObject;
  selection?: any[];
}

export type IMetadataActionSetter = (action: IMetadataAction) => IMetadataAction;

export interface IGridAction {
  id?: number;
  name: string;
  addOptions: IAddOption[];
  params?: string[];
  payload: IGridActionPayload;
  // this is initial selection, filtered by params,
  // but it can contain undefined or null values
  selection?: number[][];
  asyncMode?: boolean;
  inputParams?: IMetadataActionParam[];
  outputParams?: IMetadataActionParam[];
}
