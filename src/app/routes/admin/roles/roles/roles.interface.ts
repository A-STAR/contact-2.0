export interface IRole {
  id: number;
  name: string;
  comment: string;
}

export interface IRolesResponse {
  success: boolean;
  roles: Array<IRole>;
}
