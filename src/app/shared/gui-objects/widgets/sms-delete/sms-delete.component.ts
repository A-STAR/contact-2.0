import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';

import { ICloseAction, IGridActionParams } from '../../../components/action-grid/action-grid.interface';

import { SmsDeleteService } from './sms-delete.service';

@Component({
  selector: 'app-sms-delete-dialog',
  templateUrl: './sms-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsDeleteDialogComponent  implements OnInit {
  @Input() actionData: IGridActionParams;
  @Output() close = new EventEmitter<ICloseAction>();

  smsCounter = {
    count: null
  };

  constructor(
    private smsDeleteService: SmsDeleteService,
  ) { }

  ngOnInit(): void {
    this.smsCounter.count = this.smsDeleteService.getSmsCount(this.actionData.payload);
  }

  onConfirmDelete(): void {
    this.smsDeleteService.smsDelete(this.actionData.payload)
      .subscribe(res => {
        const refresh = !!res.massInfo && !!res.massInfo.processed;
        // NOTE: do not refresh, neither deselect if the processed is 0
        this.close.emit({ refresh, deselectAll: refresh });
      });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
