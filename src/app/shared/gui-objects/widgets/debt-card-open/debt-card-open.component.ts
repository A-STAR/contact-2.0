import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';

import { ICloseAction } from '../../../components/action-grid/action-grid.interface';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';
import { OpenDebtCardService } from './debt-card-open.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-open-debt-card',
  templateUrl: './debt-card-open.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardOpenComponent extends DialogFunctions implements OnInit {
  @Input() personId: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private openDebtCardService: OpenDebtCardService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.personId[0]) {
      this.setDialog('noPerson');
      this.cdRef.markForCheck();
      return;
    }

    this.openDebtCardService.getFirstDebtsByUserId(this.personId[0])
      .subscribe( debtId => {
        if (!debtId) {
          this.setDialog('noDebts');
          this.cdRef.markForCheck();
          return;
        }
        this.close.emit();
        this.debtorCardService.openByDebtId(debtId);
      });
  }

  onClose(): void {
    this.setDialog();
    this.close.emit();
  }
}
