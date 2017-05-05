export interface IRoleRecord {
  id: number;
  name: string;
  comment: string;
  original?: string;
};

export interface IRoleEditForm {
  id?: string;
  name: string;
  comment: string;
};
