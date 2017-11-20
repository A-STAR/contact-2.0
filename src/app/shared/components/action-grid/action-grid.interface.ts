import { IAGridAction } from '../grid2/grid2.interface';

export interface IActionGridDialogNodeParams {
  [key: string]: number | string;
}

export interface IActionGridDialogSelectionParams {
  [key: string]: Array<number | string>;
}

export interface IActionGridDialogData {
  action: IAGridAction;
  params: IActionGridDialogNodeParams;
  selection: IActionGridDialogSelectionParams;
}
