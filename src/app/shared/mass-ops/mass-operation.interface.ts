import { MetadataActionType, IMetadataActionParam } from '@app/core/metadata/metadata.interface';

export interface IAddOption {
  name: string;
  value: (string | number)[];
}

export type IActionData = any;

export interface IActionPayload {
  data: IActionData;
  type: MetadataActionType;
}

export interface IAction {
  id?: number;
  name: string;
  addOptions: IAddOption[];
  params?: string[];
  payload: IActionPayload;
  asyncMode?: boolean;
  inputParams?: IMetadataActionParam[];
  outputParams?: IMetadataActionParam[];
}

export interface ICloseAction {
  refresh?: boolean;
  deselectAll?: boolean;
  metadataAction?: IAction;
}
