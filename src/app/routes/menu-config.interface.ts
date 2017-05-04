export interface IMenuConfigItem {
  text: string;
  link: string;
  icon: string;
};

export interface IMenuConfig {
  [key: string]: IMenuConfigItem;
};
