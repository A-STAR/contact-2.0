import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IMetadataFormControl, IMetadataFormItem } from '../metadata-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-form-group',
  templateUrl: 'metadata-form-group.component.html'
})
export class MetadataFormGroupComponent {
  @Input() editable: boolean;
  @Input() formGroup: FormGroup;
  @Input() items: IMetadataFormItem[];

  getErrors(control: IMetadataFormControl): any {
    const c = this.formGroup.get(control.name);
    return c.touched ? c.errors : null;
  }
}
