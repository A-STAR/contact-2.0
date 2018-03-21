import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { IViewFormControl, IViewFormData, IViewFormItem } from './view-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-form',
  styleUrls: [ './view-form.component.scss' ],
  templateUrl: './view-form.component.html',
})
export class ViewFormComponent implements OnInit {
  @Input() data: IViewFormData = {};
  @Input() controls: IViewFormControl[] = [];

  isLoading = false;

  ngOnInit(): void {
    // implement data loading for controls
  }

  get items(): any {
    return this.controls.map(control => ({
      control,
      value: this.data && this.data[control.controlName],
    }));
  }

  getStyle(item: IViewFormItem): Partial<CSSStyleDeclaration> {
    return {
      flexBasis: item.width ? `${100 / 12 * item.width}%` : '100%',
    };
  }
}
