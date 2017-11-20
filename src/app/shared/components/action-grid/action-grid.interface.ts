import { IAGridAction } from '../grid2/grid2.interface';

export interface IActionGridDialogParams {
  [key: string]: number | string;
}

export interface IActionGridDialogData {
  action: IAGridAction;
  params: IActionGridDialogParams;
  selection: any;
}
