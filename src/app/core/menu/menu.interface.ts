export interface IMenuApiResponseItem {
  id: number;
  name: string;
  children?: Array<IMenuApiResponseItem>;
}

export interface IMenuApiResponse {
  success: boolean;
  appGuiObjects: Array<IMenuApiResponseItem>;
};

export interface IMenuItem {
  text: string;
  link: string;
  icon: string;
  children: Array<IMenuItem>;
};

export interface IGuiObjectsState {
  guiObjects: Array<IMenuApiResponseItem>;
  isResolved: boolean;
}
