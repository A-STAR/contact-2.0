import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { VisitPrepareService } from '../../visit-prepare.service';

@Component({
  selector: 'app-visit-cancel-dialog',
  templateUrl: './visit-cancel-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitCancelDialogComponent {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  constructor(
    private visitPrepareService: VisitPrepareService) {
  }

  onConfirm(): void {
    this.visitPrepareService.cancel(this.actionData.payload)
      .subscribe(() => this.onOperationResult(), () => this.onCloseDialog());
  }

  onOperationResult(): void {
    // this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
    this.close.emit({ refresh: false });
  }

  onCloseDialog(): void {
    this.close.emit();
  }
}
