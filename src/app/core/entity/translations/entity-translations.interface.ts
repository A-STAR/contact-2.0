export class EntityTranslationsConstants {
  static SPEC_DICT_NAME = 3;
  static SPEC_TERM_NAME = 12;
  static SPEC_ATTRIBUTE_NAME = 318;
  static SPEC_CONTACT_TREE_NAME = 343;
  static SPEC_CAMPAIGN_NAME = 402;
}

export interface IEntityTranslation {
  languageId: number;
  value: string;
  isMain?: number;
}
