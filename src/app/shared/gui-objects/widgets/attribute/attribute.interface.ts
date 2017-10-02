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
}

export interface IAttributeForm {
  value: number | string;
  comment: string;
}

export interface IAttributeResponse extends IAttribute {
  children: IAttributeResponse[];
}
