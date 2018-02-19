import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction, IGridAction } from '../../../../../components/action-grid/action-grid.interface';
import { IVisit, IOperationResult, IConfirmOperation } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

import { DialogFunctions } from 'app/core/dialog';

@Component({
  selector: 'app-visit-prepare-dialog',
  templateUrl: './visit-prepare-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitPrepareDialogComponent extends DialogFunctions implements OnInit {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  private prepareVisitsCount: number;
  private visitsCount: number;

  constructor(
    private visitPrepareService: VisitPrepareService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareVisitsCount = this.visitPrepareService.getVisitsCount(this.actionData.payload);
    this.visitsCount = (this.actionData.selection && this.actionData.selection.length) || 0;
    if ((this.prepareVisitsCount < this.visitsCount)
      && !this.visitPrepareService.isFilterAction(this.actionData.payload)) {
      this.setDialog('visitPrepareConfirm');
    } else {
      this.setDialog('visitPrepare');
    }
  }

  get confirmOperation(): IConfirmOperation {
    return {
      count: this.visitsCount - this.prepareVisitsCount,
      total: this.visitsCount
    };
  }

  onConfirm(): void {
    this.setDialog('visitPrepare');
  }

  onCreate(visit: IVisit): void {
    this.visitPrepareService.prepare(this.actionData.payload, visit)
      .subscribe(result => this.onOperationResult(result));
  }

  onOperationResult(result: IOperationResult): void {
    this.visitPrepareService.showOperationNotification(result);
    this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
  }

  onClose(): void {
    this.close.emit();
  }
}
