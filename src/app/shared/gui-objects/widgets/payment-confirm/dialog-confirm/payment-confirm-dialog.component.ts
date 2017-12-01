import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { DialogFunctions } from '../../../../../core/dialog';

import { PaymentConfirmService } from '../payment-confirm.service';

@Component({
  selector: 'app-payments-confirm-dialog',
  templateUrl: 'payment-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfirmDialogComponent extends DialogFunctions implements OnInit {
  @Input() paymentsIds: number[];
  @Output() close = new EventEmitter<boolean>();
  @Output() action = new EventEmitter<number[]>();

  dialog = null;

  paymentsCounter = {
    count: null
  };

  constructor(private paymentConfirmService: PaymentConfirmService) {
    super();
  }

  ngOnInit(): void {
    this.paymentsCounter.count = this.paymentsIds && this.paymentsIds.length ;
  }

  onConfirmPayments(): void {
    this.setDialog();
    this.paymentConfirmService.paymentsConfirm(this.paymentsIds)
      .subscribe(res => {
        const refresh = !!res.massInfo && !!res.massInfo.total;
        // NOTE: do not refresh if the total is 0
        this.close.emit(refresh);
      });
  }

  onCloseDialog(): void {
    this.setDialog();
    this.close.emit();
  }
}
