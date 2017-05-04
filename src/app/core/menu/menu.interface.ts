export interface IMenuApiResponseItem {
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
  children?: Array<IMenuItem>;
};
