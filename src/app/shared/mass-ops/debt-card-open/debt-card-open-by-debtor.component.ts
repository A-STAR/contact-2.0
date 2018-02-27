import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { OpenDebtCardService } from './debt-card-open.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-open-debt-card-by-debtor',
  templateUrl: './debt-card-open-by-debtor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardOpenByDebtorComponent extends DialogFunctions implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
    private openDebtCardService: OpenDebtCardService,
    private notificationsService: NotificationsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.openDebtCardService.getFirstDebtsByUserId(this.actionData.payload)
      .subscribe( debtId => {
        if (!debtId) {
          this.notificationsService.warning('header.noDebt.title').dispatch();
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
