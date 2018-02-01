import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IViewFormControl, IViewFormData, IViewFormItem } from './view-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-form',
  styleUrls: [ './view-form.component.scss' ],
  templateUrl: './view-form.component.html',
})
export class ViewFormComponent {
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
