import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { ICloseAction } from '../../../components/action-grid/action-grid.interface';

import { DialogFunctions } from '../../../../core/dialog';
import { OpenDebtCardService } from './debt-card-open.service';

@Component({
  selector: 'app-open-debt-card',
  templateUrl: './debt-card-open.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardOpenComponent extends DialogFunctions implements OnInit {
  @Input() userId: number[];
  @Output() close = new EventEmitter<ICloseAction>();

  dialog = null;

   constructor(
    private router: Router,
    private openDebtCardService: OpenDebtCardService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.openDebtCardService.getFirstDebtsByUserId(this.userId[0])
    .subscribe( debtId => {
      if (!debtId) {
        this.setDialog('noDebts');
        this.cdRef.markForCheck();
        return;
      }
        this.close.emit();
        this.router.navigate([ `/workplaces/debt-processing/${this.userId[0]}/${debtId}` ]);
      });
   }

   onClose(): void {
     this.setDialog();
     this.close.emit();
   }
}
