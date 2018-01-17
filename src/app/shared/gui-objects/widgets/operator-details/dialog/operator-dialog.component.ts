import { ChangeDetectionStrategy, Component, EventEmitter, Output, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { IOperator } from '../operator-details.interface';

import { OperatorDetailsService } from '../operator-details.service';

@Component({
  selector: 'app-operator-details',
  templateUrl: './operator-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDialogComponent implements OnInit {

  @Input() userId: number;

  @Output() close = new EventEmitter<null>();

  operator: IOperator;

  constructor(
    private cdRef: ChangeDetectorRef,
    private operatorDetailsService: OperatorDetailsService,
  ) { }

  ngOnInit(): void {
    this.operatorDetailsService.fetch(this.userId)
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
