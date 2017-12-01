import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IContactLogEntry } from '../contact-log.interface';

import { ContactLogService } from '../contact-log.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';
import { FilterComponent } from './filter/filter.component';

@Component({
  selector: 'app-workplaces-contact-log-grid',
  templateUrl: './grid.component.html',
  styleUrls: [ './grid.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() gridKey: string;

  @ViewChild(FilterComponent) filter: FilterComponent;
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IContactLogEntry>;

  rows: IContactLogEntry[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    filters.addFilter(this.filter.filters);
    const params = this.grid.getRequestParams();
    this.contactLogService.fetch(this.gridKey, filters, params)
      .subscribe((response: IAGridResponse<IContactLogEntry>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick(entry: IContactLogEntry): void {

  }
}
