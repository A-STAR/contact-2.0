import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit } from '@angular/core';

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
    private debtResponsibleService: DebtResponsibleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.debtResponsibleService.clearResponsible(this.debts)
      .subscribe(() => this.close.emit());
  }

  onClose(): void {
    this.close.emit();
  }
}
