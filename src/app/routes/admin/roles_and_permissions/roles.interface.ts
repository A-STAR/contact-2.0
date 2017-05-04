export interface IRoleRecord {
  id: number;
  name: string;
  obj_comment: string;
  original?: string;
};

export type TRoleFormAction = 'CREATE' | 'EDIT' | 'COPY' | 'DELETE';
