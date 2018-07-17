import { Observable } from 'rxjs/Observable';

export interface ITab {
  id?: number;
  title: string;
  link: string;
  disabled?: boolean;
  closable?: boolean;
  hasPermission?: Observable<boolean>;
}

export interface RouteTab {
  link: string;
  permission?: string;
}
