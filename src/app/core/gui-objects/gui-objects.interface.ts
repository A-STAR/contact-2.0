export interface IGuiObject {
  id: number;
  name: string;
  children?: Array<IGuiObject>;
}

export interface IGuiObjectsResponse {
  success: boolean;
  appGuiObjects: Array<IGuiObject>;
};

export interface IMenuItem {
  text: string;
  link: string;
  icon: string;
  children: Array<IMenuItem>;
};

export interface IGuiObjectsState {
  guiObjects: Array<IGuiObject>;
  isResolved: boolean;
}
