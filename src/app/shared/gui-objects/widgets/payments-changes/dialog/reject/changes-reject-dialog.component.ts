import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { PaymentsChangesService } from '../../payments-changes.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-payments-changes-reject-dialog',
  templateUrl: './changes-reject-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangesRejectDialogComponent extends DialogFunctions implements OnInit {

  @Input() payments: number[];

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentsChangesService: PaymentsChangesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setDialog('confirm');
  }

  onConfirm(): void {
    this.paymentsChangesService.reject(this.payments)
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