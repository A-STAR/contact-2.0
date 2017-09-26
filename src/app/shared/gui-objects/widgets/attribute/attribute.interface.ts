export interface IAttribute {
  id: number;
  code: number;
  name: string;
  typeCode: number;
  dictNameCode: number;
  disabledValue: number;
  sortOrder: number;
}

export interface IAttributeResponse extends IAttribute {
  children: IAttributeResponse[];
}
