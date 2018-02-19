import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '../../../../components/action-grid/action-grid.interface';

import { PaymentOperatorService } from '../payment-operator.service';


@Component({
  selector: 'app-payment-operator-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorConfirmDialogComponent  {
  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(private paymentOperatorService: PaymentOperatorService) {}

  onConfirm(): void {

    this.paymentOperatorService.confirm(this.actionData.payload)
      .subscribe(res => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        this.close.emit({ refresh });
      });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
