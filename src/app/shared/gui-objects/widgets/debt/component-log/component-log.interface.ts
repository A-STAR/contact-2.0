export interface IComponentLogEntry {
  typeCode: number;
  sum: number;
  currency: string;
  fromDate: string;
  toDate: string;
  userId: number;
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface IComponentLogsResponse {
  success: boolean;
  componentLogs: Array<IComponentLogEntry>;
}