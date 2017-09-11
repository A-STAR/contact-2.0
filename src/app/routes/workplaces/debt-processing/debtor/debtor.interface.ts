export interface IPerson {
  id: number;
  birthDate?: string | Date;
  firstName?: string;
  middleName?: string;
  lastName?: string,
  type?: number;
  responsibleFullName?: string;
  reward?: number;
  debtId?: number;
  product?: string;
  city?: string;
}

export interface IPersonsResponse {
  success: boolean;
  persons: Array<IPerson>;
}
