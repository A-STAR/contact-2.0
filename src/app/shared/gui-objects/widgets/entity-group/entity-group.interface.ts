export interface IEntityGroup {
  id?: number;
  name: string;
  comment?: string;
}

export type GridActionType = 'select' | 'dblclick';

export interface IGridAction {
  type: GridActionType;
  payload: IEntityGroup;
}
