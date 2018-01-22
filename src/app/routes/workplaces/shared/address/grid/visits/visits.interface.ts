export interface IVisit {
  id: number;
  debtId: number;
  contract: string;
  statusCode: number;
  purposeCode: number;
  requestUserFullName: string;
  requestDateTime: Date | string;
  prepareUserFullName: string;
  prepareDateTime: Date | string;
  planUserFullName: string;
  planVisitDateTime: Date | string;
  execUserFullName: string;
  execDateTime: Date | string;
  comment: string;
}
