import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICloseAction } from '../../../components/action-grid/action-grid.interface';

import { DebtService } from '../../../../core/debt/debt.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  selector: 'app-debt-open-incoming-call',
  templateUrl: './debt-open-incoming-call.component.html'
})
export class DebtOpenIncomingCallComponent extends DialogFunctions implements OnInit {
  @Input() debts: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private debtService: DebtService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.debts) {
      this.notificationsService.warning('header.noDebts.title').dispatch();
      this.close.emit();
      return;
    }
    this.openIncomingCall();
  }

  onClose(): void {
    this.setDialog();
    this.close.emit();
  }

  openIncomingCall(): void {
    this.router.navigate(['workplaces/incoming-call']).then(() => {
      const debtId = this.debts && this.debts.length ? this.debts[0] : null;
      this.debtService.incomingCallSearchParams = { debtId };
      this.onClose();
    });
  }

}