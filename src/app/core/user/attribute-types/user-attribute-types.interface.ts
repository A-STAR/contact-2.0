export interface IUserAttributeType {
  code: number;
  disabledValue: boolean;
  sortOrder: number;
  typeCode: number;
  children: IUserAttributeType[];
}

export enum UserAttributeTypeStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}

export interface IUserAttributeTypes {
  [key: string]: {
    attributeTypes: IUserAttributeType[];
    status: UserAttributeTypeStatusEnum;
  };
}

export interface IUserAttributeTypesState {
  attributeTypes: IUserAttributeTypes;
}

export interface IUserAttributeTypesAction {
  entityTypeId: number;
  entitySubtypeCode: number;
  attributeTypes?: IUserAttributeType[];
}
