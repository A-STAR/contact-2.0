/*
export interface IMenuItem {
  text: string;
  heading?: boolean;
  link?: string;
  icon?: string;
  alert?: string;
  submenu?: Array<any>;
}
*/

export interface IMenuApiResponseItem {
  name: string;
  children?: Array<IMenuApiResponseItem>;
}

export interface IMenuApiResponse {
  success: boolean;
  appGuiObjects: Array<IMenuApiResponseItem>;
};
