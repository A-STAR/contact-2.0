import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { PromiseResolveService } from '../../promise-resolve.service';
import { ICloseAction } from '../../../../../components/action-grid/action-grid.interface';

@Component({
  selector: 'app-promise-remove-dialog',
  templateUrl: './promise-remove-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseRemoveDialogComponent  implements OnInit {

  @Input() promises: number[];

  @Output() close = new EventEmitter<ICloseAction>();

  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) {}

  ngOnInit(): void {

  }

  onConfirm(): void {
    this.promiseResolveService.remove(this.promises)
      .subscribe(result => {
        this.close.emit({ refresh: true });
        this.cdRef.markForCheck();
      });
  }

  onClose(result: ICloseAction): void {
    this.close.emit();
  }
}
