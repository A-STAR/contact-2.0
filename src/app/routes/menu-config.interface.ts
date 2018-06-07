import { Observable } from 'rxjs/Observable';

export interface IMenuConfigItem {
  text: string;
  link: string;
  icon: string;
  docs: string;
  permission?: Observable<boolean>;
}

export interface IMenuConfig {
  [key: string]: IMenuConfigItem;
}
