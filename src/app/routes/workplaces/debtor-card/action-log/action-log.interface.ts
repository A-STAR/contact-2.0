export interface IDebtorActionLog {
  id?: number;
  createDateTime: Date | string;
  dsc: string;
  firstName: string;
  fullName: string;
  guiObject: string;
  lastName: string;
  middleName: string;
  machine: string;
  module: string;
  personId: string;
  position: string;
  typeCode: number;
  userId: string;
}
