import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IInfoDebtEntry } from '../info-debt.interface';

import { InfoDebtService } from '../info-debt.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-info-debt-grid',
  templateUrl: './grid.component.html',
})
export class GridComponent {
  @Input() gridKey: string;
  @Input() rowIdKey: string;

  @Output() select = new EventEmitter<IInfoDebtEntry[]>();

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IInfoDebtEntry>;

  rows: IInfoDebtEntry[] = [];
  rowCount = 0;

  private selectedIds: number[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private infoDebtService: InfoDebtService,
  ) {}

  get selection(): IInfoDebtEntry[] {
    return this.selectedIds.map(id => this.rows.find(row => row[this.rowIdKey] === id));
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.infoDebtService.fetch(`/list?name=${this.gridKey}`, filters, params)
      .subscribe((response: IAGridResponse<IInfoDebtEntry>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.select.emit(this.selection);
        this.cdRef.markForCheck();
      });
  }

  onSelect(ids: number[]): void {
    this.selectedIds = ids;
    this.select.emit(this.selection);
  }
}
