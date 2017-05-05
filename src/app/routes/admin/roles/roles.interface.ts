export interface IRoleRecord {
  id?: number;
  name: string;
  comment: string;
}

export interface IDisplayProperties {
  removePermit: boolean;
  addPermit: boolean;
  editPermit: boolean;
}
