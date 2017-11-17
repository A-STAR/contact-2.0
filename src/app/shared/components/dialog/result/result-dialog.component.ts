import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultDialogComponent {

  @Input() count: number;
  @Input() successCount: number;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  get messageContext(): any {
    return {
      count: this.count,
      successCount: this.successCount
    };
  }

  onClose(): void {
    this.close.emit();
  }
}
