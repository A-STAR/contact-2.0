import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { IGridControl } from './excel-filter.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-excel-filter',
  templateUrl: 'excel-filter.component.html'
})
export class ExcelFilterComponent {
  @Input() columns: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<IGridControl>();

  formGroup = new FormGroup({
    control: new FormControl(null),
  });

  onSubmit(): void {
    this.submit.emit(this.formGroup.value.control);
  }

  onClose(): void {
    this.close.emit();
  }
}
