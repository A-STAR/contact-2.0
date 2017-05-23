export interface ITerm {
  id: number;
  code: number;
  name: string;
  typeCode: number;
  parentCode: number;
  parentCodeName: string;
  isClosed: boolean;
}
