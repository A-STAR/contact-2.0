import { IEntityTranslation } from 'app/core/entity/translations/entity-translations.interface';

export interface ICurrency {
  id?: number;
  code?: string;
  multiName?: IEntityTranslation[];
  name?: string;
  multiShortName?: IEntityTranslation[];
  shortName?: string;
  isMain?: number;
}
