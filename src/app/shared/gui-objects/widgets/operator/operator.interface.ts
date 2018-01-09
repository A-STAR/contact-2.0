export interface IOperator {
  id?: number;
  fullName?: string;
  debtCnt?: number;
  organization?: string;
  position?: string;
}

export type GridActionType = 'select' | 'dblclick';

export interface IGridAction {
  type: GridActionType;
  payload: IOperator;
}
