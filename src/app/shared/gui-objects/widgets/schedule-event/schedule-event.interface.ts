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
