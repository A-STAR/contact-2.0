import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { PaymentConfirmService } from '../payment-confirm.service';

@Component({
  selector: 'app-payments-confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfirmDialogComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();


  paymentsCounter = {
    count: null
  };

  constructor(private paymentConfirmService: PaymentConfirmService) { }

  ngOnInit(): void {
    this.paymentsCounter.count = this.paymentConfirmService.getPaymentsCount(this.actionData.payload);
  }

  onConfirmPayments(): void {

    this.paymentConfirmService.paymentsConfirm(this.actionData.payload)
      .subscribe(res => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        // NOTE: do not refresh if the total is 0
        this.close.emit({ refresh });
      });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
