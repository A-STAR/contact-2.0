export interface IAttribute {
  id: number;
  code: number;
  name: string;
  typeCode: number;
  dictNameCode: number;
  disabledValue: number;
  parentId: number;
  sortOrder?: number;
  children?: IAttribute[];
}
