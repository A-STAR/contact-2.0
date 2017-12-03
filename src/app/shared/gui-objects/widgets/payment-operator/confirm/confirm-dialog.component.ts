import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction } from '../../../../components/action-grid/action-grid.interface';

import { PaymentOperatorService } from '../payment-operator.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-payment-operator-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorConfirmDialogComponent extends DialogFunctions implements OnInit {
  @Input() payments: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  dialog: string = null;
  count: number;

  constructor(private paymentOperatorService: PaymentOperatorService) {
    super();
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.setDialog();
    this.paymentOperatorService.confirm(this.payments)
      .subscribe(res => {
        const refresh = !!res.massInfo && !!res.massInfo.total;
        this.close.emit({ refresh });
      });
  }
}
