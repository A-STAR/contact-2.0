export interface IFormula {
  id?: number;
  name: string;
  typeCode: number;
  script: string;
  comment: string;
}

export interface IFormulaParams {
  debtId: number;
  userId: number;
}

export interface IFormulaResult {
  type: number;
  value: string;
}
