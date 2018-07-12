import { IActionGridAction, ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IDynamicLayoutConfig } from '@app/shared/components/dynamic-layout/dynamic-layout.interface';
import { FilterOperatorType } from '@app/shared/components/grid2/filter/grid-filter';
import { IContextMenuParams } from '@app/shared/components/grids/context-menu/context-menu.interface';
import { ToolbarElement } from '@app/shared/components/toolbar/toolbar.interface';

export type MetadataAggregateType = 'sum' | 'average' | 'max' | 'min';

export interface IMetadataActionOption {
  name: string;
  value: Array<number|string>;
}

export interface IMetadataAction {
  id?: number;
  action: string;
  // for custom actions, translates label path + action
  label?: string;
  addOptions?: IMetadataActionOption[];
  enabled?: (params: IContextMenuParams) => boolean;
  params?: string[];
  isDialog?: boolean;
  cb?: (action: any, onClose?: (data: IActionGridAction | ICloseAction) => any) => void;
  applyTo?: {
    all?: boolean;
    selected?: boolean;
  };
  children?: IMetadataAction[];
  type?: MetadataActionType;
  asyncMode?: boolean;
  outputConfig?: IDynamicLayoutConfig;
}

export enum MetadataActionType {
  SINGLE,
  SELECTED,
  ALL
}

export interface IMetadataActionPermissions {
  [key: string]: (...args: any[]) => any;
}

export interface IMetadataColumn {
  actions: string[];
  aggregate: MetadataAggregateType;
  dataType: number;
  dictCode: number;
  hidden?: boolean;
  maxWidth?: number;
  minWidth?: number;
  label?: string;
  name: string;
  width?: number;
}

export type IMetadataFilterType = 'dictionaries' | 'entityGroups' | 'portfolios' | 'users' | 'contractors';

export interface IMetadataFilterOption {
  name: string;
  value: Array<number|string>;
}

export interface IMetadataFilter {
  controls: IDynamicFormControl[];
  operators: IMetadataFilterOperator[];
}

export interface IMetadataFilterOperator {
  type: FilterOperatorType;
  columnName: string;
  controls: string[];
}
export interface IMetadataResponse {

  name: string;
  actions: IMetadataAction[];
  data: IMetadataColumn[];
  baseFilters: IMetadataFilter[];
}

export interface IMetadataTitlebarItem extends ToolbarElement {
  name: string;
  params?: any[];
  permissions?: string[];
}

export interface IMetadataTitlebar {
  items?: IMetadataTitlebarItem[];
  label?: string;
}

export interface IMetadata {
  actions: IMetadataAction[];
  columns: Array<IMetadataColumn>;
  status: MetadataListStatusEnum;
  filters: IMetadataFilter[];
  titlebar?: IMetadataTitlebar;
  defaultAction?: string;
  selectionAction?: string;
  permits?: string[];
  primary?: string;
}

export interface IMetadataState {
  [key: string]: IMetadata;
}

export enum MetadataListStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}
