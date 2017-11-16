import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { IOperator } from '../../operator/operator.interface';

import { OperatorService } from '../operator.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';

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
    private messageBusService: MessageBusService,
  ) { }

  ngOnInit(): void {
    this.operatorSelectSub = this.messageBusService
      .select<string, IOperator>(OperatorService.MESSAGE_OPERATOR_SELECTED, 'select')
      .subscribe(operator => {
        this.selectedOperator = operator;
        this.cdRef.markForCheck();
      });
    this.operatorClickSub = this.messageBusService
      .select<string, IOperator>(OperatorService.MESSAGE_OPERATOR_SELECTED, 'dblclick')
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
