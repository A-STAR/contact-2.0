import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { PromiseResolveService } from '../../promise-resolve.service';

@Component({
  selector: 'app-promise-confirm-dialog',
  templateUrl: './promise-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseConfirmDialogComponent  {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();


  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) { }

  onConfirm(): void {
    this.promiseResolveService.confirm(this.actionData.payload)
      .subscribe(() => {
        // this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
        this.close.emit({ refresh: false });
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
