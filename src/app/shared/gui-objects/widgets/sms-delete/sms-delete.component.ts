import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { ICloseAction } from '../../../components/action-grid/action-grid.interface';

import { SmsDeleteService } from './sms-delete.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-sms-delete-dialog',
  templateUrl: './sms-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsDeleteDialogComponent extends DialogFunctions implements OnInit {
  @Input() smsId: number[];
  @Output() close = new EventEmitter<ICloseAction>();

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
        const refresh = !!res.massInfo && !!res.massInfo.processed;
        // NOTE: do not refresh, neither deselect if the processed is 0
        this.close.emit({ refresh, deselectAll: refresh });
      });
  }

}
