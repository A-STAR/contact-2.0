import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridActionParams } from '../../../../../components/action-grid/action-grid.interface';

import { PromiseResolveService } from '../../promise-resolve.service';

@Component({
  selector: 'app-promise-confirm-dialog',
  templateUrl: './promise-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseConfirmDialogComponent  {

  @Input() actionData: IGridActionParams;

  @Output() close = new EventEmitter<ICloseAction>();


  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) { }

  onConfirm(): void {
    this.promiseResolveService.confirm(this.actionData.payload)
      .subscribe(result => {
        this.close.emit({ refresh: result.massInfo && !!result.massInfo.processed });
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
