export type MetadataAggregateType = 'sum' | 'average' | 'max' | 'min';

export interface IMetadataActionOption {
  name: string;
  value: Array<number|string>;
}

export interface IMetadataAction {
  action: string;
  params: string[];
  addOptions: IMetadataActionOption[];
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

export type IMetadataFilterType = 'dictionaries' | 'entityGroups' | 'portfolios' | 'users';

export interface IMetadataFilterOption {
  name: string;
  value: Array<number|string>;
}

export interface IMetadataFilter {
  type: IMetadataFilterType;
  column: string;
  addOptions?: IMetadataFilterOption[];
}

export interface IMetadata {
  name: string;
  actions: IMetadataAction[];
  data: IMetadataColumn[];
  baseFilters: IMetadataFilter[];
}

export interface IMetadataState {
  [key: string]: {
    actions: IMetadataAction[];
    columns: Array<IMetadataColumn>;
    status: MetadataListStatusEnum;
    filters: IMetadataFilter[];
  };
}

export enum MetadataListStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}
