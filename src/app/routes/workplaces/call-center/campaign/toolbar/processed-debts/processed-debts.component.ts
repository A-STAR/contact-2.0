import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-call-center-toolbar-processed-debts',
  templateUrl: 'processed-debts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessedDebtsComponent {
  @Output() close = new EventEmitter<void>();

  columns = [];

  rows = [];

  onClose(): void {
    this.close.emit();
  }
}
