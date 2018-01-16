import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IViewFormControl, IViewFormData, IViewFormItem } from '../view-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-form-group',
  styleUrls: [ './view-form-group.component.scss' ],
  templateUrl: './view-form-group.component.html',
})
export class ViewFormGroupComponent {
  @Input() data: IViewFormData = {};
  @Input() controls: IViewFormControl[] = [];

  get items(): any {
    return this.controls.map(control => ({ control, value: this.data[control.controlName] }));
  }

  getStyle(item: IViewFormItem): Partial<CSSStyleDeclaration> {
    return {
      flexBasis: item.width ? `${100 / 12 * item.width}%` : '100%',
    };
  }
}
