export interface IEmployment {
  id?: number;
  workTypeCode: number;
  company?: string;
  position?: string;
  hireDate?: Date | string;
  dismissDate?: Date | string;
  income?: number;
  currencyId?: number;
  comment?: string;
}
