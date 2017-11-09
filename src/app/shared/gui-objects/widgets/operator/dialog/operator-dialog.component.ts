import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
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

  private operatorSubscription: Subscription;

  constructor(
    private messageBusService: MessageBusService,
  ) { }

  ngOnInit(): void {
    this.operatorSubscription = this.messageBusService
      .select<string, IOperator>(OperatorService.MESSAGE_OPERATOR_SELECTED)
      .subscribe(operator => {
        this.select.emit(operator);
        this.close.emit();
      });
  }

  ngOnDestroy(): void {
    this.operatorSubscription.unsubscribe();
  }

  onClose(): void {
    this.close.emit();
  }
}
