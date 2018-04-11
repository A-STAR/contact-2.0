import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  IMetadataFormConfig,
  IMetadataFormControlType,
} from '@app/shared/components/form/metadata-form/metadata-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person-filter',
  templateUrl: 'select-person-filter.component.html'
})
export class SelectPersonFilterComponent {
  readonly filterForm: IMetadataFormConfig = {
    editable: true,
    items: [
      {
        disabled: false,
        display: true,
        label: 'ID',
        name: 'id',
        type: IMetadataFormControlType.TEXT,
        validators: {},
        width: 0,
      },
    ],
    plugins: [],
  };
}
