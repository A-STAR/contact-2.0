export interface IAttribute {
  id: number;
  code: number;
  name: string;
  typeCode: number;
  // TODO(d.maltsev): typings typings typings
  dict: any[];
  disabledValue: number;
  sortOrder: number;
}

export interface IAttributeResponse extends IAttribute {
  children: IAttributeResponse[];
}
