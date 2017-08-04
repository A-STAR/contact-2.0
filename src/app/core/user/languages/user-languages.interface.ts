export interface IUserLanguage {
  id: number;
  code: string;
  name: string;
  isMain: boolean;
}

export interface IUserLanguageOption {
  label: string;
  value: number;
}

export interface IUserLanguagesResponse {
  success: boolean;
  languages: Array<IUserLanguage>;
}

export interface IUserLanguagesState {
  languages: Array<IUserLanguage>;
}
