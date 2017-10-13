export type MetadataAggregateType = 'sum' | 'average' | 'max' | 'min';

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

export interface IMetadata {
  name: string;
  data: IMetadataColumn[];
}

export interface IMetadataState {
  [key: string]: {
    columns: Array<IMetadataColumn>,
    status: MetadataListStatusEnum
  };
}

export enum MetadataListStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}
