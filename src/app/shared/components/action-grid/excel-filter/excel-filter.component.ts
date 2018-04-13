import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';

import { IGridControl } from './excel-filter.interface';
import { ExcelFilteringService } from '@app/shared/components/action-grid/excel-filtering.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-excel-filter',
  templateUrl: 'excel-filter.component.html'
})
export class ExcelFilterComponent {
  @Input() columns: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<IGridControl[]>();

  readonly formGroup = this.excelFilteringService.formGroup;

  constructor(
    private excelFilteringService: ExcelFilteringService,
  ) {}

  get canSubmit(): boolean {
    return this.formGroup.valid;
  }

  get controls(): any {
    return (this.formGroup.controls.filters as FormArray).controls;
  }

  onAdd(): void {
    this.excelFilteringService.add();
  }

  onRemove(i: number): void {
    this.excelFilteringService.remove(i);
  }

  onSubmit(): void {
    this.submit.emit(this.excelFilteringService.value);
  }

  onClose(): void {
    this.close.emit();
  }

  onClear(): void {
    this.excelFilteringService.clear();
    this.submit.emit([]);
  }
}
