export interface IAuthState {
  token: string;
  params: IUserParams;
}

export interface IUser {
  userId: number;
  userName: string;
}

export interface IUserParams {
  usePbx: number;
}
