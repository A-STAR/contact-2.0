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
}

export interface IAttributeResponse extends IAttribute {
  children: IAttributeResponse[];
}
