export type MetadataAggregateType = 'sum' | 'average' | 'max' | 'min';

export interface IMetadataColumn {
  name: string;
  dataType: number;
  dictCode: number;
  aggregate: MetadataAggregateType;
  actions: string[];
}

export interface IMetadata {
  name: string;
  data: IMetadataColumn[];
}

export interface IMetadataResponse {
  success: boolean;
  lists: IMetadata[];
}

export interface IMetadataState {
  lists: IMetadataListsState
}

export interface IMetadataListsState {
  [key: string]: IMetadataColumn[];
}
