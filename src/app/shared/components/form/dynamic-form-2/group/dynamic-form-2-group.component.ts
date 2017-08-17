import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormGroup, IDynamicFormItem } from '../dynamic-form-2.interface';

@Component({
  selector: 'app-dynamic-form-2-group',
  templateUrl: './dynamic-form-2-group.component.html',
  styleUrls: [ './dynamic-form-2-group.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicForm2GroupComponent {
  @Input() group: IDynamicFormGroup;
  @Input() formGroup: FormGroup;

  getItemClass(item: IDynamicFormItem): string {
    return `col-xs-${item.width || 12}`;
  }

  trackByFn(index: number): number {
    return index;
  }
}
