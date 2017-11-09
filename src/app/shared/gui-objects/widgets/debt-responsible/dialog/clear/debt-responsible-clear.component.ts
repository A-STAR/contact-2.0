import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, OnInit } from '@angular/core';

import { DebtResponsibleService } from '../../debt-responsible.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-debt-responsible-clear',
  templateUrl: './debt-responsible-clear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleClearComponent extends DialogFunctions implements OnInit {

  @Output() close = new EventEmitter<null>();

  dialog: string = null;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtResponsibleService: DebtResponsibleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.debtResponsibleService.clearResponsible()
      .subscribe(() => {
        this.setDialog('clearResult');
        this.cdRef.markForCheck();
      });
  }

  onClose(): void {
    this.close.emit();
  }
}
