export interface IMultiLanguageOption {
  active?: boolean;
  label: string;
  languageId: number;
  isMain?: number;
  isUpdated?: boolean;
  value: string;
}

export interface IMultiLanguageConfig {
  entityAttributeId: number;
  entityId?: number;
}
