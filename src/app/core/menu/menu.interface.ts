export interface IMenuItem {
  text: string;
  heading?: boolean;
  link?: string;
  icon?: string;
  alert?: string;
  submenu?: Array<any>;
}

export interface IMenuApiResponse {
  menu: Array<IMenuItem>;
};
