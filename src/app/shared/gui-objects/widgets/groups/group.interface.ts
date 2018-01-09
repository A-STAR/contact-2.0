export interface IGroup {
  id?: number;
  entityTypeCode: number;
  multiName?: {
    value: string;
    languageId: number;
  }[];
  name: string;
  comment?: string;
  isManual?: number;
  isPreCleaned?: number;
  userFullName?: string;
  formDateTime?: string;
  sql?: string;
  userId?: number;
}
