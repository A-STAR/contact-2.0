export interface IDebtorActionLog {
  id: number;
  fullName: string;
  createDateTime: Date | string;
  module: string;
  typeCode: number;
  dsc: string;
  machine: string;
}
