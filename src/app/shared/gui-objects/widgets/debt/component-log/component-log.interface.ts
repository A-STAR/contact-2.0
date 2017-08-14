export interface IComponentLogEntry {
  directionCode: number;
  portfolioName: string;
  fromDate: string;
  toDate: string;
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface IComponentLogsResponse {
  success: boolean;
  componentLogs: Array<IComponentLogEntry>;
}
