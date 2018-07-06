export interface IUIState {
  [key: string]: Record<string, any>;
}

export enum UIActionType {
  UPDATE = '[ui] update',
}

export interface IUIGenericAction {
  type: UIActionType;
}

export interface IUIUpdateAction {
  type: UIActionType.UPDATE;
  payload: {
    key: string;
    state: any;
  };
}

export type IUIAction = IUIUpdateAction;
