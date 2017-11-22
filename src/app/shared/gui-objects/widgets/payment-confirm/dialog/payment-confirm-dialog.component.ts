import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { DialogFunctions } from '../../../../../core/dialog';

import { PaymentConfirmService } from '../payment-confirm.service';

@Component({
  selector: 'app-payments-confirm-dialog',
  templateUrl: 'payment-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfirmDialogComponent extends DialogFunctions implements OnChanges {
  @Input() paymentsIds: number[];
  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<number[]>();

  dialog = null;

  paymentsCounter = {
    count: null
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentConfirmService: PaymentConfirmService,
  ) {
    super();
    this.setDialog('enqueryConfirm');
  }
  ngOnChanges(): void {
    console.log(this.paymentsIds);
    if (this.paymentsIds) {
      this.paymentsCounter.count = this.paymentsIds.length;
    }
      this.cdRef.markForCheck();
  }

  public any: any;


  onConfirmPayments(): void {
    // setInterval(() => {
    //   this.setDialog();
    // }, 5000);
    console.log('start on confirm', this.paymentsIds);
    this.paymentConfirmService.paymentsConfirm(this.paymentsIds)
    .catch((err) => {
      console.log('catchen error');
      return err;
    })
    .subscribe((res) => {
      console.log('res from server', res);
      setTimeout(() => {
        this.setDialog('infoConfirm');
        this.any = res;
          this.cdRef.markForCheck();
        }, 2000);
      });
  }

  onCloseDialog(): void {
    this.setDialog();
    this.close.emit();
  }
}
