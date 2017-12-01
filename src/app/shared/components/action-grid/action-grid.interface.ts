export interface IActionGridDialogNodeParams {
  [key: string]: number | string;
}

export interface IActionGridDialogSelectionParams {
  [key: string]: Array<number | string>;
}

export interface IActionGridDialogData {
  addOptions: { name: string; value: (string | number)[] }[];
  params: IActionGridDialogNodeParams;
  selection: IActionGridDialogSelectionParams;
}
