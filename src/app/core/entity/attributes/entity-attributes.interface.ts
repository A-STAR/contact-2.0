export interface IEntityAttribute {
  isMandatory: boolean;
  isUsed: boolean;
}

export interface IEntityAttributes {
  [key: number]: IEntityAttribute;
}

export enum EntityAttributesStatusEnum {
  PENDING,
  LOADED,
  ERROR
}

export interface IEntityAttributesState {
  [key: number]: IEntityAttribute;
}
