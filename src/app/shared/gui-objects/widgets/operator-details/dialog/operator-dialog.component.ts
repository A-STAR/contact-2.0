import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IOperator } from '../operator-details.interface';

import { OperatorDetailsService } from '../operator-details.service';

@Component({
  selector: 'app-operator-details',
  templateUrl: './operator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDialogComponent implements OnInit {

  @Input() actionData: IGridAction;

  @Output() close = new EventEmitter<null>();

  operator: IOperator;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorDetailsService: OperatorDetailsService,
  ) { }

  ngOnInit(): void {
    this.operatorDetailsService.fetch(this.actionData.payload)
      .pipe(first())
      .subscribe(operator => {
        this.operator = operator;
        this.cdRef.markForCheck();
      }, () => this.close.emit());
  }

  onClose(): void {
    this.close.emit();
  }
}
