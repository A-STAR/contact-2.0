import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { FilterOperatorType } from '@app/shared/components/grid2/filter/grid-filter';

export type MetadataAggregateType = 'sum' | 'average' | 'max' | 'min';

export interface IMetadataActionOption {
  name: string;
  value: Array<number|string>;
}

export interface IMetadataAction {
  action: string;
  addOptions: IMetadataActionOption[];
  enabled: (selection: any[]) => boolean;
  params: string[];
  applyTo?: {
    all: boolean;
    selected?: boolean;
  };
  children?: IMetadataAction[];
  type?: MetadataActionType;
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

export interface IMetadata {
  actions: IMetadataAction[];
  columns: Array<IMetadataColumn>;
  status: MetadataListStatusEnum;
  filters: IMetadataFilter[];
}

export interface IMetadataState {
  [key: string]: IMetadata;
}

export enum MetadataListStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}
