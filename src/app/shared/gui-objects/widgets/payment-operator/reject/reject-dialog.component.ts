import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction } from '../../../../components/action-grid/action-grid.interface';

import { PaymentOperatorService } from '../payment-operator.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-payment-operator-reject-dialog',
  templateUrl: './reject-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorRejectDialogComponent extends DialogFunctions implements OnInit {
  @Input() payments: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  dialog: string = null;
  count: number;

  constructor(private paymentOperatorService: PaymentOperatorService) {
    super();
  }

  ngOnInit(): void {
  }

  onReject(): void {
    this.setDialog();
    this.paymentOperatorService.reject(this.payments)
      .subscribe(res => {
        const refresh = !!res.massInfo && !!res.massInfo.total;
        this.close.emit({ refresh });
      });
  }

}
