export interface ITab {
  active?: boolean;
  component: any;
  title: string;
  path: string;
  closable?: boolean;
  factory: any;
  injector: any;
}

export enum TabEventStageEnum {
  NAVIGATION_START,
  TAB_OPEN,
}

export interface ITabEvent {
  time: Date;
  stage: TabEventStageEnum;
}
