import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { PromiseResolveService } from '../../promise-resolve.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-promise-confirm-dialog',
  templateUrl: './promise-confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseConfirmDialogComponent extends DialogFunctions implements OnInit {

  @Input() promises: number[];

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private promiseResolveService: PromiseResolveService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.setDialog('confirm');
  }

  onConfirm(): void {
    this.promiseResolveService.confirm(this.promises)
      .subscribe(result => {
        this.count = result.massInfo.total;
        this.successCount = result.massInfo.processed;
        this.setDialog('result');
        this.cdRef.markForCheck();
      });
  }

  onClose(result: boolean): void {
    this.close.emit(result);
  }
}
