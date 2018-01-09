export interface IVisit {
  purposeCode?: number;
  planVisitDateTime: string | Date;
  planUserId: number;
  comment: string;
}

export interface IVisitOperator {
  id?: number;
  fullName?: string;
  organization?: string;
  position?: string;
}

export interface IOperationResult {
  success: boolean;
  massInfo: {
    total: number;
    processed: number;
  };
}

export interface IConfirmOperation {
  count: number;
  total: number;
}
