export interface IAttribute {
  id: number;
  code: number;
  name: string;
  typeCode: number;
  dictNameCode: number;
  disabledValue: number;
  parentId: number;
}

export interface IAttributeResponse extends IAttribute {
  children: IAttributeResponse[];
  sortOrder: number;
}
