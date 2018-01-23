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

export interface ISchedulePeriod {
  periodTypeCode: number;
  dayPeriod?: number;
  weekDays?: number[];
}

export enum ScheduleEventEnum {
  GROUP = 1
}

export interface IScheduleType {
  eventTypeCode: number;
  groupId?: number;
}

export interface IScheduleGroup {
  id?: number;
  name: string;
  comment?: string;
  entityTypeId: number;
}

export interface IScheduleStartRequest {
  checkGroup?: 0 | 1;
}
