import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { PaymentOperatorService } from '../payment-operator.service';

@Component({
  selector: 'app-payment-operator-reject-dialog',
  templateUrl: './reject-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorRejectDialogComponent  {
  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(private paymentOperatorService: PaymentOperatorService) {}

  onReject(): void {
    this.paymentOperatorService.reject(this.actionData.payload)
      .subscribe(res => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        this.close.emit({ refresh });
      });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
