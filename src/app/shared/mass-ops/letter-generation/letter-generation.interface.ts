export interface ILetterGenerationParams {
  templateId: number;
  formatCode: number;
  regLetter?: number;
  addressTypes: number[];
  avoidDuplication?: number;
  ignoreWrongAddress?: number;
  sortRule?: number[];
  reportId?: number;
}
