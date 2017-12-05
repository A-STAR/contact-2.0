import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { PromiseResolveService } from '../../promise-resolve.service';
import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-promise-confirm-dialog',
  templateUrl: './promise-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseConfirmDialogComponent  {

  @Input() promises: number[];

  @Output() close = new EventEmitter<ICloseAction>();


  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) { }

  onConfirm(): void {
    this.promiseResolveService.confirm(this.promises)
      .subscribe(result => {
        this.close.emit({ refresh: true });
        this.cdRef.markForCheck();
      });
  }

  onClose(result: ICloseAction): void {
    this.close.emit();
  }
}
