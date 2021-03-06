import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { PaymentConfirmService } from '../payment-confirm.service';

@Component({
  selector: 'app-payments-cancel-dialog',
  templateUrl: 'cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCancelDialogComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  paymentsCounter = {
    count: null
  };

  constructor(
    private paymentConfirmService: PaymentConfirmService,
  ) {}

  ngOnInit(): void {
    this.paymentsCounter.count = this.paymentConfirmService.getPaymentsCount(this.actionData.payload);
  }

  onCancelPayments(): void {
    this.paymentConfirmService.paymentsCancel(this.actionData.payload)
      .subscribe(() => {
        // const refresh = res.massInfo && !!res.massInfo.processed;
        // NOTE: do not refresh if the total is 0
        // this.close.emit({ refresh });
        this.close.emit({ refresh: false });
      });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
