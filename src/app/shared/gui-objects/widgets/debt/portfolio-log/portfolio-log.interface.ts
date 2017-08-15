export interface IPortfolioLogEntry {
  directionCode: number;
  portfolioName: string;
  fromDate: string;
  toDate: string;
  userId: number;
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface IPortfolioLogsResponse {
  success: boolean;
  portfolioLogs: Array<IPortfolioLogEntry>;
}
