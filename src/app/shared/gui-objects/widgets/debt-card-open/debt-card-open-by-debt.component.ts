import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ICloseAction, IGridActionParams } from '@app/shared/components/action-grid/action-grid.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

import { DialogFunctions } from '@app/core/dialog';
import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

@Component({
  selector: 'app-open-debt-card-by-debt',
  templateUrl: './debt-card-open-by-debt.component.html'
})
export class DebtCardOpenByDebtComponent extends DialogFunctions implements OnInit {
  @Input() actionData: IGridActionParams;
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private debtorCardService: DebtorCardService
  ) {
    super();
  }

  ngOnInit(): void {
    this.close.emit();
    const { debtId } = this.actionGridFilterService.buildRequest(this.actionData.payload);
    this.debtorCardService.openByDebtId(debtId);
  }

  onClose(): void {
    this.setDialog();
    this.close.emit();
  }

}
