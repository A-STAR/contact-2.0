import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'app-debtor-debts',
  templateUrl: 'debts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtsComponent {
  debt: any;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  onDebtSelect(debt: any): void {
    this.debt = debt;
    this.cdRef.markForCheck();
  }
}
