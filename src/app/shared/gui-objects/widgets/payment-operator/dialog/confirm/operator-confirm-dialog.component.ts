import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { PaymentOperatorService } from '../../payment-operator.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-payment-operator-confirm-dialog',
  templateUrl: './operator-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorConfirmDialogComponent extends DialogFunctions implements OnInit {

  @Input() payments: number[];

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentOperatorService: PaymentOperatorService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setDialog('confirm');
  }

  onConfirm(): void {
    this.paymentOperatorService.confirm(this.payments)
      .subscribe(result => {
        this.count = result.massInfo.total;
        this.successCount = result.massInfo.processed;
        this.setDialog('result');
        this.cdRef.markForCheck();
      });
  }

  onClose(result: boolean): void {
    this.close.emit(result);
  }
}
