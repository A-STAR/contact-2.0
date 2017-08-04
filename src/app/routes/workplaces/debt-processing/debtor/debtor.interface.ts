export interface IPerson {
  id: number;
  birthDate: string | Date;
}

export interface IPersonsResponse {
  success: boolean;
  persons: Array<IPerson>;
}
