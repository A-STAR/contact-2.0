import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

import { DebtResponsibleService } from '../../debt-responsible.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-debt-responsible-clear',
  templateUrl: './debt-responsible-clear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleClearComponent extends DialogFunctions implements OnInit {

  @Input() debts: number[];
  @Output() close = new EventEmitter<null>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtResponsibleService: DebtResponsibleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.debtResponsibleService.clearResponsible(this.debts)
      .subscribe(result => {
        this.count = result.count;
        this.successCount = result.successCount;
        this.setDialog('clearResult');
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
