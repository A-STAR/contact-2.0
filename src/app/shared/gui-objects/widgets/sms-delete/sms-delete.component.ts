import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { DialogFunctions } from '../../../../core/dialog';

import { SmsDeleteService } from './sms-delete.service';

@Component({
  selector: 'app-sms-delete-dialog',
  templateUrl: './sms-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsDeleteDialogComponent extends DialogFunctions implements OnInit {
  @Input() smsId: number[];
  @Output() close = new EventEmitter<boolean>();

  dialog = null;
  smsCounter = {
    count: null
  };

  constructor(
  private smsDeleteService: SmsDeleteService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.smsCounter.count = this.smsId && this.smsId.length;
  }

  onConfirmDelete(): void {
    this.setDialog();
    this.smsDeleteService.smsDelete(this.smsId)
      .subscribe(res => {
        const refresh = !!res.massInfo && !!res.massInfo.total;
        // NOTE: do nto refresh if the total is 0
        this.close.emit(refresh);
        this.setDialog();
      });
  }

  onCloseDialog(): void {
    this.close.emit(false);
    this.setDialog();
  }
}
