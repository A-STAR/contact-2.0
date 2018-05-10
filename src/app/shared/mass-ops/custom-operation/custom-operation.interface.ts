import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

export interface ICustomOperationParam {
  id?: number;
  name: string;
  paramTypeCode: number;
  sortOrder: number;
  systemName: string;
  isMandatory: number;
  multiSelect: number;
  dictNameCode: number;
}

export interface ICustomOperationGridAction extends IGridAction {
  paramsData?: ICustomOperationParam[];
}
