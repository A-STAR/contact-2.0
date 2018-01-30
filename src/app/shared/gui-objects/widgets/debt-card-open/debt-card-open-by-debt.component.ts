import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { ICloseAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-open-debt-card-by-debt',
  templateUrl: './debt-card-open-by-debt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardOpenByDebtComponent extends DialogFunctions implements OnInit {
  @Input() debtId: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.debtId[0]) {
      this.notificationsService.warning('header.noDebts.title').dispatch();
      this.close.emit();
      this.cdRef.markForCheck();
      return;
    }
    this.close.emit();
    this.debtorCardService.openByDebtId(this.debtId[0]);
  }

  onClose(): void {
    this.setDialog();
    this.close.emit();
  }

}
