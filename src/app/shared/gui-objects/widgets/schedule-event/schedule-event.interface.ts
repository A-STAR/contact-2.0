export interface IScheduleEvent {
  id?: number;
  groupId: number;
  groupName: string;
  eventTypeCode: number;
  periodTypeCode: number;
  startTime: string;
  executeDateTime: string;
  isExecuted: number;
  startDate: string;
  endDate: string;
  isInactive: number;
  priority: number;
}

export enum SchedulePeriodEnum {
  DAILY = 1,
  WEEKLY = 2,
}

export enum ScheduleEventEnum {
  GROUP = 1,
  SMS = 2,
  EMAIL = 3,
  DICT1CODE = 4,
  DICT2CODE = 5,
  DICT3CODE = 6,
  DICT4CODE = 7,
  DEBTSTAGE = 8,
  USERCHANGE = 9
}

export interface ISchedulePeriod {
  periodTypeCode: number;
  dayPeriod?: number;
  weekDays?: number[];
}

export interface IScheduleType {
  eventTypeCode?: number;
  groupId?: number;
  checkGroup?: number;
  additionalParameters?: IScheduleParam[];
}

export interface IScheduleParam {
  name: string;
  value: string;
}

export interface IScheduleGroup {
  id?: number;
  name: string;
  comment?: string;
  entityTypeId: number;
}

export interface IScheduleUser {
  id?: number;
  fullName: string;
  organization: string;
  position: string;
}

export interface IScheduleStartRequest {
  checkGroup?: 0 | 1;
}
