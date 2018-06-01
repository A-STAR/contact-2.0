import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IVisit } from '../../visit-prepare.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

@Component({
  selector: 'app-visit-prepare-dialog',
  templateUrl: './visit-prepare-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitPrepareDialogComponent {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

  constructor(
    private visitPrepareService: VisitPrepareService) {}

  onCreate(visit: IVisit): void {
    this.visitPrepareService
      .prepare(this.actionData.payload, visit)
      .subscribe(() => this.onOperationResult());
  }

  onOperationResult(): void {
    // this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
    this.close.emit({ refresh: false });
  }

  onClose(): void {
    this.close.emit();
  }
}
