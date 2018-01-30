import { Observable } from 'rxjs/Observable';

export interface ITab {
  disabled?: boolean;
  link: string;
  title: string;
  hasPermission?: Observable<boolean>;
}
