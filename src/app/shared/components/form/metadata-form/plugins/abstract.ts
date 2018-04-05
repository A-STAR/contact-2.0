import { FormGroup } from '@angular/forms';

import { IMetadataFormEvent, IMetadataFormPlugin } from '../metadata-form.interface';

export abstract class AbstractPlugin {
  constructor(
    protected formGroup: FormGroup,
    protected plugin: IMetadataFormPlugin,
  ) {}

  abstract handle(event: IMetadataFormEvent): void;
}
