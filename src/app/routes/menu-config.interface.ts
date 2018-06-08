export interface IMenuConfigItem {
  text: string;
  link: string;
  icon: string;
  docs: string;
  permission?: string[];
}

export interface IMenuConfig {
  [key: string]: IMenuConfigItem;
}
