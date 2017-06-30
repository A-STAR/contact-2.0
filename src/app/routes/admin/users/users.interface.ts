export interface IUser {
  id: number;
  login: string;
  roleId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  comment: string;
  email: string;
  password: string;
  workPhone: string;
  mobPhone: string;
  intPhone: string;
  workAddress: string;
  position: string;
  startWorkDate: string | Date;
  endWorkDate: string | Date;
  languageId: number;
  isBlocked: boolean;
}

export interface IUsersResponse {
  success: boolean;
  users: Array<IUser>;
}

export enum IUserDialogActionEnum {
  USER_ADD,
  USER_EDIT
}

export interface IUsersState {
  users: Array<IUser>;
  selectedUserId: number;
  dialogAction: IUserDialogActionEnum;
  displayBlocked: boolean;
}
