export interface IScheduleEvent {
  id?: number;
  groupId: number;
  groupName: string;
  eventTypeCode: number;
  periodTypeCode: number;
  startTime: string;
  executeDateTime: string;
  isExecuting: number;
  startDate: string;
  endDate: string;
  isInactive: number;
  priority: number;
}

export enum SchedulePeriodEnum {
  DAILY = 1,
  WEEKLY = 2,
}

export interface ISchedulePeriod {
  periodTypeCode: number;
  dayPeriod?: number;
  weekDays?: number[];
  monthDays?: number[];
}

export interface IScheduleDate {
  date?: string | Date;
}

export interface IScheduleType {
  eventTypeCode?: number;
  groupId?: number;
  checkGroup?: number;
  additionalParameters?: IScheduleParam[];
}

export interface IScheduleParam {
  name: string;
  value: any;
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
