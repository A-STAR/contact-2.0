import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IInfoDebtEntry } from '../info-debt.interface';

import { InfoDebtService } from '../info-debt.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

@Component({
  selector: 'app-info-debt-grid',
  templateUrl: './grid.component.html',
  styleUrls: [ './grid.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() gridKey: string;
  @Input() rowIdKey: string;

  @Output() select = new EventEmitter<IInfoDebtEntry[]>();

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IInfoDebtEntry>;

  rows: IInfoDebtEntry[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private infoDebtService: InfoDebtService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.infoDebtService.fetch(`/list?name=${this.gridKey}`, filters, params)
      .subscribe((response: IAGridResponse<IInfoDebtEntry>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onSelect(ids: number[]): void {
    this.select.emit(ids.map(id => this.rows.find(row => row[this.rowIdKey] === id)));
  }
}
