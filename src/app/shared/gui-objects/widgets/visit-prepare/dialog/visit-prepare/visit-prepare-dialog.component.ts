import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IVisit, IOperationResult, IConfirmOperation } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

import { DialogFunctions } from 'app/core/dialog';

@Component({
  selector: 'app-visit-prepare-dialog',
  templateUrl: './visit-prepare-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitPrepareDialogComponent extends DialogFunctions implements OnInit {

  @Input() visits: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  private prepareVisits: number[];

  constructor(
    private visitPreapreService: VisitPrepareService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareVisits = this.visits.filter(visit => !!visit);
    if (this.prepareVisits.length < this.visits.length) {
      this.setDialog('visitPrepareConfirm');
    } else {
      this.setDialog('visitPrepare');
    }
  }

  get confirmOperation(): IConfirmOperation {
    return {
      count: this.visits.length - this.prepareVisits.length,
      total: this.visits.length
    };
  }

  onConfirm(): void {
    this.setDialog('visitPrepare');
  }

  onCreate(visit: IVisit): void {
    this.visitPreapreService.prepare(this.prepareVisits, visit)
      .subscribe(result => this.onOperationResult(result));
  }

  onOperationResult(result: IOperationResult): void {
    this.visitPreapreService.showOperationNotification(result);
    this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
  }

  onClose(): void {
    this.close.emit();
  }
}
