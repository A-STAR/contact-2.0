export interface IMultiLanguageOption {
  active?: boolean;
  label: string;
  languageId: number;
  isMain?: number;
  isRemoved?: boolean;
  isUpdated?: boolean;
  value: string;
}

export interface IMultiLanguageConfig {
  entityAttributeId: number;
  entityId?: number;
}
