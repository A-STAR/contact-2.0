export interface IAuthState {
  token: string;
  params: IUserParams;
}

export interface IUser {
  userId: number;
}

export interface IUserParams {
  usePbx: number;
}
