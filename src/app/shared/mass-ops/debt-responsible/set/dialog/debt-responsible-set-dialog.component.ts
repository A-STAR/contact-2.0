import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IOperator, IGridAction } from '../debt-responsible-set.interface';

import { DebtResponsibleSetService } from '../debt-responsible-set.service';

@Component({
  selector: 'app-debt-responsible-set-dialog',
  templateUrl: './debt-responsible-set-dialog.component.html',
  host: { class: 'full-height' },
  styleUrls: ['./debt-responsible-set-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtResponsibleSetDialogComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IOperator>();

  private selectedOperator: IOperator;
  private operatorSelectSub: Subscription;
  private operatorClickSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtResponsibleSetService: DebtResponsibleSetService
  ) { }

  ngOnInit(): void {
    this.operatorSelectSub = this.debtResponsibleSetService
      .getPayload<IGridAction>(DebtResponsibleSetService.MESSAGE_OPERATOR_SELECTED)
      .filter(action => action.type === 'select')
      .map(action => action.payload)
      .subscribe(operator => {
        this.selectedOperator = operator;
        this.cdRef.markForCheck();
      });
    this.operatorClickSub = this.debtResponsibleSetService
      .getPayload<IGridAction>(DebtResponsibleSetService.MESSAGE_OPERATOR_SELECTED)
      .filter(action => action.type === 'dblclick')
      .map(action => action.payload)
      .subscribe(operator => {
        this.selectedOperator = operator;
        this.select.emit(this.selectedOperator);
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.operatorSelectSub.unsubscribe();
    this.operatorClickSub.unsubscribe();
  }

  get hasSelection(): boolean {
    return !!this.selectedOperator;
  }

  onSelect(): void {
    this.select.emit(this.selectedOperator);
  }

  onClose(): void {
    this.close.emit();
  }
}
