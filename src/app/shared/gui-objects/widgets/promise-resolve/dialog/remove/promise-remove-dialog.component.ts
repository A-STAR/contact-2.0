import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input } from '@angular/core';

import { PromiseResolveService } from '../../promise-resolve.service';
import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';

@Component({
  selector: 'app-promise-remove-dialog',
  templateUrl: './promise-remove-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseRemoveDialogComponent {

  @Input() promises: number[];

  @Output() close = new EventEmitter<ICloseAction>();


  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) {}



  onConfirm(): void {
    this.promiseResolveService.remove(this.promises)
      .subscribe(result => {
        this.close.emit({ refresh: true });
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
