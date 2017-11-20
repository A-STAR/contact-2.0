import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';

import { ContactLogService } from '../contact-log.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

// TODO(d.maltsev)
type T = any;

@Component({
  selector: 'app-workplaces-contact-log-grid',
  templateUrl: './grid.component.html',
  styleUrls: [ './grid.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() gridKey: string;

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<T>;

  rows: T[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.contactLogService.fetch(this.gridKey, filters, params)
      .subscribe((response: IAGridResponse<T>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  onDblClick(debt: T): void {

  }
}
