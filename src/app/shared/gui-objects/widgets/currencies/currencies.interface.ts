// todo
export interface ICurrencies {
  id?: number;
  entityTypeCode: number;
  name: string;
  comment?: string;
  isManual?: number;
  isPreCleaned?: number;
  userFullName?: string;
  formDateTime?: string;
  sql?: string;
}
