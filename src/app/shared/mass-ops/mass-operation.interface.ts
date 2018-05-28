import { MetadataActionType } from '@app/core/metadata/metadata.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';

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
  name?: string;
  addOptions?: IAddOption[];
  params?: string[];
  payload?: IActionPayload;
  asyncMode?: boolean;
  outputConfig?: IDynamicLayoutConfig;
}

export interface ICloseAction {
  refresh?: boolean;
  metadataAction?: IAction;
}
