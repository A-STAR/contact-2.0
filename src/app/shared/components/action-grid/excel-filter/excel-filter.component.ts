import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-excel-filter',
  templateUrl: 'excel-filter.component.html'
})
export class ExcelFilterComponent {
  @Input() columns: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  formGroup = new FormGroup({
    control: new FormControl(null),
  });

  onSubmit(): void {
    console.log(this.formGroup.value);
    this.submit.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
