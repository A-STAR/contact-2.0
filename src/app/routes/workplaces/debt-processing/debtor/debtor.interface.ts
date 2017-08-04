export interface IPerson {
  id: number;
}

export interface IPersonsResponse {
  success: boolean;
  persons: Array<IPerson>;
}
