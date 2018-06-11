export enum TaskStatus {
  START_SUCCESS  = 2,
  FINISH_SUCCESS = 3,
  FINISH_ERROR   = 4,
}

export enum TaskEventType {
  MASS_OPERATION    = 1,
  CUSTOM_OPERATION  = 2,
  LETTER_GENERATION = 3,
}

export interface IGenericTaskEvent {
  id: number;
  statusCode: TaskStatus;
  taskTypeCode: number;
  msg: string;
  createDateTime: string;
}

export interface IMassInfoPayload {
  created: number;
  processed: number;
  total: number;
}

export interface ILetterPayload {
  letterGuid: string;
  reportGuid: string;
}

export interface ICustomOperationPayload {
  data: any[];
}

export interface IStartSuccessTaskEvent extends IGenericTaskEvent {
  statusCode: TaskStatus.START_SUCCESS;
}

export interface IFinishErrorTaskEvent extends IGenericTaskEvent {
  statusCode: TaskStatus.FINISH_ERROR;
}

export interface IFinishSuccessGenericEvent extends IGenericTaskEvent {
  statusCode: TaskStatus.FINISH_SUCCESS;
  taskEventTypeCode: TaskEventType;
}

export interface IMassOperationEvent extends IFinishSuccessGenericEvent {
  taskEventTypeCode: TaskEventType.MASS_OPERATION;
  payload: {
    massInfo: Partial<IMassInfoPayload>;
  };
}

export interface ICustomOperationEvent extends IFinishSuccessGenericEvent {
  taskEventTypeCode: TaskEventType.CUSTOM_OPERATION;
  payload: {
    customOperationResult: ICustomOperationPayload;
    massInfo: Partial<IMassInfoPayload>;
  };
}

export interface ILetterGenerationEvent extends IFinishSuccessGenericEvent {
  taskEventTypeCode: TaskEventType.LETTER_GENERATION;
  payload: {
    letter: ILetterPayload;
    massInfo: Partial<IMassInfoPayload>;
  };
}

export type IFinishSuccessTaskEvent =
  | IMassOperationEvent
  | ICustomOperationEvent
  | ILetterGenerationEvent
;

export type ITaskEvent =
  | IStartSuccessTaskEvent
  | IFinishSuccessTaskEvent
  | IFinishErrorTaskEvent
;
