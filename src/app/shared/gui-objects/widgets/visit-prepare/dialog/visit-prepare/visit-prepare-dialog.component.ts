import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IVisit, IOperationResult } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

@Component({
  selector: 'app-visit-prepare-dialog',
  templateUrl: './visit-prepare-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitPrepareDialogComponent  {

  @Input() visits: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private visitPreapreService: VisitPrepareService,
  ) {}

  onCreate(visit: IVisit): void {
    this.visitPreapreService.prepare(this.visits, visit)
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
