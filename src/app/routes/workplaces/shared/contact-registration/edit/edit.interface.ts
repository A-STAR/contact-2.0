export interface IEditSection {
  canSubmit: boolean;
  submitRequest: (callback: (data: any) => void) => void;
}
