import { GetContextMenuItemsParams } from 'ag-grid';
import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';

export interface ISimpleAction {
  name: string;
  action?: () => void;
}

export type IContextMenuSimpleOptions = Array<ISimpleAction | string>;

export interface IContextMenuOptions {
  actions: IMetadataAction[];
  selected: any[];
  selection: GetContextMenuItemsParams;
  cb: (action: IAGridAction) => void;
}
export interface IContextMenuParams {
  action: IMetadataAction;
  selected: any[];
  selection: any;
}
