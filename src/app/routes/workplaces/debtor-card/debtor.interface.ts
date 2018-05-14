export interface IPerson {
  id: number;
  birthDate?: Date;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  type?: number;
  reward?: number;
  debtId?: number;
  product?: string;
  city?: string;
  typeCode: number;
}

export interface IDebt {
  id: number;
  personId: number;
  responsibleFullName: string;
  shortInfo: string;
  statusCode: number;
  typeCode: number;
  utc: string;
}
