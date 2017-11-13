import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-contact-log-dialog',
  templateUrl: 'contact-log-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactLogDialogComponent {
  @Input() personId: number;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
