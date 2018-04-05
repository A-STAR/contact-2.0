export interface IMenuConfigItem {
  text: string;
  link: string;
  icon: string;
  docs: string;
}

export interface IMenuConfig {
  [key: string]: IMenuConfigItem;
}
