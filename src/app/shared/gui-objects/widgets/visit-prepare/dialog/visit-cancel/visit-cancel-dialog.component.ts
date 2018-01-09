import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IOperationResult, IConfirmOperation } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

import { DialogFunctions } from 'app/core/dialog';

@Component({
  selector: 'app-visit-cancel-dialog',
  templateUrl: './visit-cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCancelDialogComponent extends DialogFunctions implements OnInit {

  @Input() visits: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  private cancelVisits: number[];

  constructor(
    private visitPrepareService: VisitPrepareService
  ) {
    super();
  }

  ngOnInit(): void {
    this.cancelVisits = this.visits.filter(visit => !!visit);
    if (this.cancelVisits.length < this.visits.length) {
      this.setDialog('visitCancelConfirm');
    } else {
      this.setDialog('visitCancel');
    }
  }

  get confirmOperation(): IConfirmOperation {
    return {
      count: this.visits.length - this.cancelVisits.length,
      total: this.visits.length
    };
  }

  onConfirm(): void {
    this.visitPrepareService.cancel(this.cancelVisits)
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
