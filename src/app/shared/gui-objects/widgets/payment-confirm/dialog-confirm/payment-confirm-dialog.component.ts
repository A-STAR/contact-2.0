import { ChangeDetectionStrategy, ChangeDetectorRef,
         Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';

import { DialogFunctions } from '../../../../../core/dialog';

import { PaymentConfirmService } from '../payment-confirm.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';

@Component({
  selector: 'app-payments-confirm-dialog',
  templateUrl: 'payment-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentConfirmDialogComponent extends DialogFunctions implements OnChanges, OnInit {
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
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setDialog('enqueryConfirm');
  }

  ngOnChanges(): void {
    this.paymentsCounter.count = this.paymentsIds &&  this.paymentsIds.length ;
    this.cdRef.markForCheck();
  }

  onConfirmPayments(): void {
    this.setDialog();
    this.cdRef.markForCheck();
    this.paymentConfirmService.paymentsConfirm(this.paymentsIds)
      .subscribe((res) => {
          this.totalCount = res.massInfo.total;
          this.successCount = res.massInfo.processed;
          this.setDialog('infoConfirm');
          this.cdRef.markForCheck();
        });
  }

  onCloseDialog(): void {
    this.setDialog();
    this.close.emit();
  }
}
