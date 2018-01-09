export interface IOperationResult {
  success: boolean;
  massInfo: {
    total: number;
    processed: number;
  };
}
