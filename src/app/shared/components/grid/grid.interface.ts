import { IAGridColumn } from '@app/shared/components/grid2/grid2.interface';
import { IMetadataAction, IMetadataTitlebar } from '@app/core/metadata/metadata.interface';

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
  titlebar?: IMetadataTitlebar;
  defaultAction?: string;
  permits?: string[];
}
