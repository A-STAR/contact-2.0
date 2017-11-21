import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payments-confirm-dialog',
  templateUrl: 'payment-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfirmDialogComponent {
  @Input() paymentsNumber: number;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
