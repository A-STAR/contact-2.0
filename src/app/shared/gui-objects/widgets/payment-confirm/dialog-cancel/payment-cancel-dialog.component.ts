import { ChangeDetectionStrategy, ChangeDetectorRef,
         Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';

import { DialogFunctions } from '../../../../../core/dialog';

import { PaymentConfirmService } from '../payment-confirm.service';

@Component({
  selector: 'app-payments-cancel-dialog',
  templateUrl: 'payment-cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentCancelDialogComponent extends DialogFunctions implements OnChanges, OnInit {
  @Input() paymentsIds: number[];
  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<number[]>();

  dialog = null;

  paymentsCounter = {
    count: null
  };

  totalCount: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentConfirmService: PaymentConfirmService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setDialog('enqueryCancel');
  }

  ngOnChanges(): void {
    this.paymentsCounter.count = this.paymentsIds &&  this.paymentsIds.length ;
    this.cdRef.markForCheck();
  }

  onCancelPayments(): void {
    this.setDialog();
    this.cdRef.markForCheck();
    this.paymentConfirmService.paymentsCancel(this.paymentsIds)
    .subscribe((res) => {
          this.totalCount = res.massInfo.total;
          this.successCount = res.massInfo.processed;
          this.setDialog('infoCancel');
          this.cdRef.markForCheck();
      });
  }

  onCloseDialog(): void {
    this.setDialog();
    this.close.emit();
  }
}
