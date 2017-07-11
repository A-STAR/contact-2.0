export interface ILookupUser {
  id: number;
  name: string;
}

export interface ILookupUsersResponse {
  success: boolean;
  users: Array<ILookupUser>;
}

export interface ILookupRole {
  id: number;
  name: string;
}

export interface ILookupRolesResponse {
  success: boolean;
  users: Array<ILookupRole>;
}

export interface ILookupState {
  roles: Array<ILookupRole>;
  users: Array<ILookupUser>;
  isResolved: boolean;
}
