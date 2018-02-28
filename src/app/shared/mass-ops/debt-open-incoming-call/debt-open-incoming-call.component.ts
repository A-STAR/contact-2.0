import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { ActionGridFilterService } from '@app/shared/components/action-grid/filter/action-grid-filter.service';
import { DebtService } from '@app/core/debt/debt.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-debt-open-incoming-call',
  templateUrl: './debt-open-incoming-call.component.html'
})
export class DebtOpenIncomingCallComponent extends DialogFunctions implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private actionGridFilterService: ActionGridFilterService,
    private router: Router,
    private debtService: DebtService
  ) {
    super();
  }

  ngOnInit(): void {
    this.openIncomingCall();
  }

  onClose(): void {
    this.setDialog();
    this.close.emit();
  }

  openIncomingCall(): void {
    this.router.navigate(['workplaces/incoming-call']).then(() => {
      this.debtService.incomingCallSearchParams = this.actionGridFilterService.buildRequest(this.actionData.payload);
      this.onClose();
    });
  }

}