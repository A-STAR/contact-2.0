export interface IPerson {
  id: number;
  birthDate?: string | Date;
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
