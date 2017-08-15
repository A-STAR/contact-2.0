import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-debt-grid-status-dialog',
  templateUrl: './debt-grid-status-dialog.component.html'
})
export class DebtGridStatusDialogComponent {
  @Output() close = new EventEmitter<void>();

  controls = [];
  data = {};

  onSubmit(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
