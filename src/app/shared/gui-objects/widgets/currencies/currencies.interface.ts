export interface ICurrency {
  id?: number;
  code?: number;
  multiName?: {
    value: string;
    languageId: number;
  }[];
  name?: string;
  multiShortName?: {
    value: string;
    languageId: number;
  }[];
  shortName?: string;
  isMain?: number;
}
