import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-debtor-debts',
  templateUrl: 'debts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtsComponent {
  debtId: number;
  debtStatusCode: number;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  onDebtSelect(debt: any): void {
    this.debtId = debt.id;
    this.debtStatusCode = debt.statusCode;
    this.cdRef.markForCheck();
  }
}
