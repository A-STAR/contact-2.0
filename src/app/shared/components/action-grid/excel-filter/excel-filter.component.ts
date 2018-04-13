import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { IGridControl } from './excel-filter.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-excel-filter',
  templateUrl: 'excel-filter.component.html'
})
export class ExcelFilterComponent {
  @Input() columns: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<IGridControl[]>();

  formGroup = this.formBuilder.group({
    filters: this.formBuilder.array([
      this.initFilter(),
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  get controls(): any {
    return (this.formGroup.controls.filters as FormArray).controls;
  }

  onSubmit(): void {
    this.submit.emit(this.formGroup.value.filters.map(f => f.control));
  }

  onClose(): void {
    this.close.emit();
  }

  onAdd(): void {
    this.formGroup.controls['filters']['push'](this.initFilter());
  }

  onRemove(i: number): void {
    this.formGroup.controls['filters']['removeAt'](i);
  }

  private initFilter(): FormGroup {
    return this.formBuilder.group({
      control: this.formBuilder.control(null),
    });
  }
}
