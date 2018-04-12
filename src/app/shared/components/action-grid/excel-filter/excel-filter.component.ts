import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-excel-filter',
  templateUrl: 'excel-filter.component.html'
})
export class ExcelFilterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
