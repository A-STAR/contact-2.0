import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, EventEmitter, Input, Output, OnChanges
} from '@angular/core';

import { DialogFunctions } from '../../../../../core/dialog';

import { SmsDeleteService } from '../sms-delete.service';

@Component({
  selector: 'app-sms-delete-dialog',
  templateUrl: './sms-delete-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsDeleteDialogComponent extends DialogFunctions implements OnChanges {
  @Input() smsId: number[];
  @Output() close = new EventEmitter<boolean>();

  dialog = null;
  smsCounter = {
    count: null
  };
  successCount: number;
  totalCount: number;

  constructor(
  private cdRef: ChangeDetectorRef,
  private smsDeleteService: SmsDeleteService,
  ) {
    super();
  }

  ngOnChanges(): void {
    this.smsCounter.count = this.smsId && this.smsId.length ;
    this.cdRef.markForCheck();
  }

  onConfirmDelete(): void {
    this.setDialog();
    this.cdRef.markForCheck();
    this.smsDeleteService.smsDelete(this.smsId)
      .subscribe(res => {
        // this.totalCount = res.massInfo.total;
        // this.successCount = res.massInfo.processed;
        this.cdRef.markForCheck();
      });
  }

  onCloseDialog(): void {
      const changeSuccess = !!this.successCount;
      this.successCount = 0;
      this.setDialog();
      this.close.emit(changeSuccess);
    }
}
