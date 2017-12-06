import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ICloseAction } from '../../../components/action-grid/action-grid.interface';

import { OpenDebtCardService } from './debt-card-open.service';

@Component({
  selector: 'app-open-debt-card',
  templateUrl: './debt-card-open.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtCardOpenComponent implements OnInit {
  @Input() userId: number[];
  @Output() close = new EventEmitter<ICloseAction>();

   constructor(
    private router: Router,
    private openDebtCardService: OpenDebtCardService,
  ) {
  }

  ngOnInit(): void {
    this.close.emit();
    this.openDebtCardService.getFirstDebtsByUserId(this.userId[0])
      .subscribe( debtId => this.router.navigate([ `/workplaces/debt-processing/${this.userId[0]}/${debtId}` ]) );
  }
}
