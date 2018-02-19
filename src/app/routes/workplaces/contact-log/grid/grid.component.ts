import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IContactLogEntry } from '../contact-log.interface';

import { ContactLogService } from '../contact-log.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

@Component({
  selector: 'app-workplaces-contact-log-grid',
  templateUrl: './grid.component.html',
  host: { class: 'full-height'},
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() gridKey: string;
  @Input() rowIdKey: string;

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IContactLogEntry>;

  rows: IContactLogEntry[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
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
