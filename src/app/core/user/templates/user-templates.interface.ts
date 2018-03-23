export interface IUserTemplate {
  id: number;
  isSingleSending: boolean;
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

export interface IUserLetterTemplate {
  id: number;
  name: string;
}
