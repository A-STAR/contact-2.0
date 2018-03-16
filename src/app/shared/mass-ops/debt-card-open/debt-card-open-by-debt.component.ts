import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter} from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-open-debt-card-by-debt',
  templateUrl: './debt-card-open-by-debt.component.html',
})
export class DebtCardOpenByDebtComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private debtorCardService: DebtorCardService
  ) {}

  ngOnInit(): void {
    this.close.emit();
    const { debtId } = this.actionGridFilterService.buildRequest(this.actionData.payload);
    setTimeout(() => this.debtorCardService.openByDebtId(debtId), 0);
  }

}
