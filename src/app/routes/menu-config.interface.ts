export enum MenuItemType {
  ROUTE,
  HELP,
}

export interface IMenuConfigItem {
  type: MenuItemType;
  text: string;
  link: string;
  icon: string;
  docs: string;
  permission?: string[];
}

export interface IMenuConfig {
  [key: string]: IMenuConfigItem;
}
