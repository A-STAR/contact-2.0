export interface IEntityAttribute {
  isMandatory: boolean;
  isUsed: boolean;
}

export interface IEntityAttributeResponse extends IEntityAttribute {
  success: boolean;
}

export enum EntityAttributesStatusEnum {
  PENDING,
  LOADED,
  ERROR
}

export interface IEntityAttributesState {
  [key: number]: {
    attribute: IEntityAttribute;
    status: EntityAttributesStatusEnum;
  }
}
