export interface IScheduleEventEntry {
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
  DAILY,
  WEEKLY
}

export interface ISchedulePeriod {
  periodTypeCode: number;
  dayPeriod?: number;
  weekDays?: number[];
}

export enum ScheduleEventEnum {
  GROUP
}

export interface IScheduleGroup {
  id?: number;
  name: string;
  comment?: string;
  entityTypeId: number;
}
