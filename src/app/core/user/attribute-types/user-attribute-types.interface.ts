export interface IUserAttributeType {
  code: number;
  disabledValue: boolean;
  sortOrder: number;
  typeCode: number;
  children: IUserAttributeType[];
}

export interface IUserAttributeTypes {
  [key: string]: IUserAttributeType[];
}

export interface IUserAttributeTypesState {
  attributeTypes: IUserAttributeTypes;
}

export interface IUserAttributeTypesAction {
  entityTypeId: number;
  entitySubtypeCode: number;
  attributeTypes?: IUserAttributeType[];
}
