export interface IDebt {
  id: number;
  personId: number;
  responsibleFullName: string;
  shortInfo: string;
  statusCode: number;
  typeCode: number;
  utc: string;
}

export interface IPerson {
  birthDate: string;
  id: number;
  typeCode: number;
}
