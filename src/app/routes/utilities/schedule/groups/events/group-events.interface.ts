export interface IGroupEvent {
  id?: number;
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
