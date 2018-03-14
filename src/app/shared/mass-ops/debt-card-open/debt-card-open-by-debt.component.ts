import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';

@Component({
  selector: 'app-open-debt-card-by-debt',
  templateUrl: './debt-card-open-by-debt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtCardOpenByDebtComponent implements OnInit, OnDestroy {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private debtorCardService: DebtorCardService
  ) { }

  ngOnInit(): void {
    this.close.emit();
  }

  ngOnDestroy(): void {
    const { debtId } = this.actionGridFilterService.buildRequest(this.actionData.payload);
    this.debtorCardService.openByDebtId(debtId);
  }

}
