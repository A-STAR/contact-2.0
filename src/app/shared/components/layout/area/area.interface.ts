export enum IAreaLayout {
  ROW    = 'row',
  COLUMN = 'column',
}

export interface IDragData {
  start: number;
  i: number;
  a: number;
  b: number;
}
