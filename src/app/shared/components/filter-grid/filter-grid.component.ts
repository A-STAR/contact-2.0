import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { IAGridResponse } from '../grid2/grid2.interface';
import { IFilterEntry, IFilterControl } from './filter-grid.interface';

import { FilterGridService } from './filter-grid.service';

import { ActionGridComponent } from '../action-grid/action-grid.component';
import { GridFilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-filter-grid',
  templateUrl: './filter-grid.component.html',
  styleUrls: [ './filter-grid.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterGridComponent {
  @Input() gridKey: string;
  @Input() controls: IFilterControl[];

  @ViewChild(GridFilterComponent) filter: GridFilterComponent;
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IFilterEntry>;

  rows: IFilterEntry[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private filterGridService: FilterGridService,
  ) {}

  onRequest(): void {
    this.fetch();
  }

  private fetch(): void {
    const filters = this.grid.getFilters();
    filters.addFilter(this.filter.filters);
    const params = this.grid.getRequestParams();
    this.filterGridService.filter(this.gridKey, filters, params)
      .subscribe((response: IAGridResponse<IFilterEntry>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }
}
