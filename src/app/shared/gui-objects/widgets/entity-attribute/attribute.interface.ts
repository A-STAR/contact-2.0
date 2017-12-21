export interface IAttribute {
  code: number;
  name: string;
  typeCode: number;
  valueN: number;
  valueB: number;
  valueS: string;
  valueD: string;
  dictNameCode: number;
  comment: string;
  userId: number;
  userFullName: string;
  changeDateTime: string;
  sortOrder: number;
  disabledValue: number;
  children?: IAttribute[];
  version?: number;
}

export interface IAttributeForm {
  value: number | string;
  comment: string;
}

export interface IAttributeVersion {
  userFullName: string;
  typeCode: number;
  changeDateTime?: string;
  fromDateTime?: string;
  toDateTime?: string;
  dictNameCode: number;
  valueN: number;
  valueB: number;
  valueS: string;
  valueD: string;
}

export interface IAttributeVersionForm {
  value: number | string;
  changeDateTime: string;
}

export interface IAttributeVersionParams {
  selectedAttribute: IAttribute;
  entityId: number;
  entityTypeId: number;
}
