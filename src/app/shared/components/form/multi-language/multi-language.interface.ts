export interface IMultiLanguageOption {
  value: number;
  label: string;
}

export interface IMultiLanguageOptionSelection {
  removed: boolean;
  selected: boolean;
  value: number;
}

export interface IMultiLanguageValue {
  languageId: number;
  value: string;
}
