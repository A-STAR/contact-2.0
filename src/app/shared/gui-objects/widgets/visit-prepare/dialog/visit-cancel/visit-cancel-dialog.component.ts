import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';
import { IOperationResult } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

@Component({
  selector: 'app-visit-cancel-dialog',
  templateUrl: './visit-cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCancelDialogComponent {

  @Input() visits: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private visitPrepareService: VisitPrepareService
  ) { }

  onConfirm(): void {
    this.visitPrepareService.cancel(this.visits)
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
