import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { IPayment } from '../payments.interface';
import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';

import { PaymentsService } from '../payments.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

@Component({
  selector: 'app-workplaces-payments-grid',
  templateUrl: './payments-grid.component.html',
  styleUrls: ['./payments-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PaymentsGridComponent {

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IPayment>;

  rows: IPayment[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paymentsService: PaymentsService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.paymentsService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IPayment>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick(entry: IPayment): void {

  }

}
