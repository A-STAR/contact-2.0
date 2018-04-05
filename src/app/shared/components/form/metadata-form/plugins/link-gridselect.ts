import { IMetadataFormEvent } from '../metadata-form.interface';

import { AbstractPlugin } from './abstract';

export class LinkGridSelectPlugin extends AbstractPlugin {
  handle(event: IMetadataFormEvent): void {
    const { from, to, key } = this.plugin;
    if (event.control.name === from) {
      this.formGroup.patchValue({ [to]: event.row[key] });
    }
  }
}
