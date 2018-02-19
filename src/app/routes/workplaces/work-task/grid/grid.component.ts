import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IWorkTaskEntry } from '../work-task.interface';

import { WorkTaskService } from '../work-task.service';

import { ActionGridComponent } from '../../../../shared/components/action-grid/action-grid.component';

@Component({
  selector: 'app-work-task-grid',
  host: { class: 'full-height' },
  templateUrl: './grid.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  @Input() gridKey: string;
  @Input() rowIdKey: string;

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IWorkTaskEntry>;

  rows: IWorkTaskEntry[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private workTaskService: WorkTaskService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.workTaskService.fetch(this.gridKey, filters, params)
      .subscribe((response: IAGridResponse<IWorkTaskEntry>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }
}
