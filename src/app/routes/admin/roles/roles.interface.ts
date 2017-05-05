export interface IRoleRecord {
  id: number;
  name: string;
  obj_comment: string;
  original?: string;
}

export interface IDisplayProperties {
  removePermit: boolean;
  addPermit: boolean;
  editPermit: boolean;
}

