import { GetContextMenuItemsParams } from 'ag-grid';
import { IAGridAction } from '@app/shared/components/grid2/grid2.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';

export interface IContextMenuOptions {
  actions: IMetadataAction[];
  selected: any[];
  selection: GetContextMenuItemsParams;
  cb: (action: IAGridAction) => void;
}
