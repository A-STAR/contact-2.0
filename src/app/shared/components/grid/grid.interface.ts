import { IAGridColumn } from '@app/shared/components/grid2/grid2.interface';
import { IMetadataAction, IMetadataToolbar } from '@app/core/metadata/metadata.interface';
import { Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

export type TRendererType = Function | Array<any>
  | 'checkboxRenderer'
  | 'dateRenderer'
  | 'dateTimeRenderer'
  | 'numberRenderer'
  | 'phoneRenderer'
  | 'yesNoRenderer'
  ;

export interface IMetadataDefs {
  actions: IMetadataAction[];
  columns?: IAGridColumn[];
  titlebar?: IMetadataToolbar | Toolbar;
  defaultAction?: string;
  selectionAction?: string;
  permits?: string[];
  primary?: string;
}
