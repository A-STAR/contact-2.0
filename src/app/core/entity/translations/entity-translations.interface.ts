export class EntityTranslationsConstants {
  static SPEC_DICT_NAME = 3;
  static SPEC_TERM_NAME = 12;
  static SPEC_ATTRIBUTE_NAME = 318;
}

export interface IEntityTranslation {
  languageId: number;
  value: string;
  isMain?: number;
}
