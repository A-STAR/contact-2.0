/**
 * List of Entity translation constants as per @doc http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=87359496
 */
export class EntityTranslationsConstants {
  static SPEC_DICT_NAME = 3;
  static SPEC_TERM_NAME = 12;
  static SPEC_CURRENCY_NAME = 162;
  static SPEC_CURRENCY_SHORT_NAME = 163;
  static SPEC_TEMPLATE_ATTRIBUTE_USER_NAME = 313;
  static SPEC_ATTRIBUTE_TYPE_NAME = 318;
  static SPEC_CONTACT_TREE_NAME = 343;
  static SPEC_GROUP_NAME = 396;
  static SPEC_CAMPAIGN_NAME = 402;
}

export interface IEntityTranslation {
  languageId: number;
  value: string;
  isMain?: number;
}

export interface IEntitytTranslationValue extends IEntityTranslation {
  label: string;
}
