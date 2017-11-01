export interface IUserTemplate {
  id: number;
  name: string;
}

export enum TemplateStatusEnum {
  PENDING,
  LOADED,
  ERROR,
}

export interface IUserTemplates {
  [key: string]: {
    templates: IUserTemplate[];
    status: TemplateStatusEnum;
  };
}

export interface IUserTemplatesState {
  templates: IUserTemplates;
}
