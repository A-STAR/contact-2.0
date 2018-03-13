import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';

import { PromiseResolveService } from '../../promise-resolve.service';

@Component({
  selector: 'app-promise-remove-dialog',
  templateUrl: './promise-remove-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseRemoveDialogComponent {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<ICloseAction>();


  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) {}



  onConfirm(): void {
    this.promiseResolveService.remove(this.actionData.payload)
      .subscribe(result => {
        this.close.emit({ refresh: true });
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
