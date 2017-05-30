export interface ITab {
  active?: boolean;
  component: any;
  title: string;
  path: string;
  closable?: boolean;
  factory: any;
  injector: any;
}
