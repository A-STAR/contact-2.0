import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IOperator, IGridAction } from '../../operator/operator.interface';

import { OperatorService } from '../operator.service';

@Component({
  selector: 'app-operator-dialog',
  templateUrl: './operator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDialogComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<null>();
  @Output() select = new EventEmitter<IOperator>();

  private selectedOperator: IOperator;
  private operatorSelectSub: Subscription;
  private operatorClickSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorService: OperatorService
  ) { }

  ngOnInit(): void {
    this.operatorSelectSub = this.operatorService
      .getPayload<IGridAction>(OperatorService.MESSAGE_OPERATOR_SELECTED)
      .filter(action => action.type === 'select')
      .map(action => action.payload)
      .subscribe(operator => {
        this.selectedOperator = operator;
        this.cdRef.markForCheck();
      });
    this.operatorClickSub = this.operatorService
      .getPayload<IGridAction>(OperatorService.MESSAGE_OPERATOR_SELECTED)
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
