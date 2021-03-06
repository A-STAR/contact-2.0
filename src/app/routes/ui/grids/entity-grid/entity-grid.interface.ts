import { Observable } from 'rxjs/Observable';

import { IGridColumn, IGridSelectionType } from '@app/shared/components/grids/grids.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

export interface IMetadataEntityGridConfig {
  apiKey: string;
  entityKey: string;
  translationKey: string;
  persistenceKey: string;
  selectionType: IGridSelectionType;
  actions: IEntityActionMetadata[];
  columns: IGridColumn<IGridEntity>[];
}

export interface IEntityActionMetadata {
  type: string;
  permissions: string[];
  params?: any;
}

export interface IEntityGridAction {
  type: string;
  title?: string;
  buttonType?: ButtonType;
  enabled: (permissions: string[]) => Observable<boolean>;
  action: () => void;
}

export interface IGridEntity {
  id?: number;
}
