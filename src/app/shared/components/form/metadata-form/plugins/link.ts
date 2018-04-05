import { AbstractPlugin } from './abstract';
import { IMetadataFormEvent } from '../metadata-form.interface';

export class LinkPlugin extends AbstractPlugin {
  handle(event: IMetadataFormEvent): void {
    const { link, name } = this.plugin;
    if (event.control.name === name) {
      this.formGroup.patchValue({ [link]: event.row.contractorId });
    }
  }
}
