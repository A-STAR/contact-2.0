import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-debt-grid-close-dialog',
  templateUrl: './debt-grid-close-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtGridCloseDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onSubmit(): void {
    this.submit.emit();
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
