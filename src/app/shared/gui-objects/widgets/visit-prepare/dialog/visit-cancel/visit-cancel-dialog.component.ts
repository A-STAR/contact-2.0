import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction, IGridAction } from '../../../../../components/action-grid/action-grid.interface';
import { IOperationResult, IConfirmOperation } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

import { DialogFunctions } from 'app/core/dialog';

@Component({
  selector: 'app-visit-cancel-dialog',
  templateUrl: './visit-cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCancelDialogComponent extends DialogFunctions implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  private cancelVisitsCount: number;
  private visitsCount: number;

  constructor(
    private visitPrepareService: VisitPrepareService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cancelVisitsCount = this.visitPrepareService.getVisitsCount(this.actionData.payload);
    this.visitsCount = (this.actionData.selection && this.actionData.selection.length) || 0;
    if ((this.cancelVisitsCount < this.visitsCount)
      && !this.visitPrepareService.isFilterAction(this.actionData.payload)) {
      this.setDialog('visitCancelConfirm');
    } else {
      this.setDialog('visitCancel');
    }
  }

  get confirmOperation(): IConfirmOperation {
    return {
      count: this.visitsCount - this.cancelVisitsCount,
      total: this.visitsCount
    };
  }

  onConfirm(): void {
    this.visitPrepareService.cancel(this.actionData.payload)
      .subscribe(result => this.onOperationResult(result), () => this.onCloseDialog());
  }

  onOperationResult(result: IOperationResult): void {
    this.visitPrepareService.showOperationNotification(result);
    this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
