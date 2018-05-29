import { MetadataActionType, IMetadataAction } from '@app/core/metadata/metadata.interface';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { IActionData, IAction } from '@app/shared/mass-ops/mass-operation.interface';

export enum ActionOperator {
  HAS,
  NOT_EMPTY,
  CONTAINS,
  AND,
  OR,

}

export interface IGridActionPayload {
  data: IGridActionData;
  type: MetadataActionType;
}

export interface IGridActionFilterSelection extends IActionData {
  filtering: FilterObject;
  gridName: string;
  columnNames: string[];
}

export interface IGridActionSingleSelection extends IActionData {
  [key: string]: any;
}

export type IGridActionSelection = number[][];

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

export interface IGridAction extends IAction {
  payload: IGridActionPayload;
  selection?: number[][];
  rowData?: any;
}
