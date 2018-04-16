import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';

import { SelectPersonService } from '../select-person.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person-grid',
  templateUrl: 'select-person-grid.component.html'
})
export class SelectPersonGridComponent {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  private _rowCount: number;
  private _rows = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private selectPersonService: SelectPersonService,
  ) {}

  get rowCount(): number {
    return this._rowCount;
  }

  get rows(): any[] {
    return this._rows;
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();

    this.selectPersonService
      .fetch(filters, params)
      .subscribe((response: IAGridResponse<any>) => {
        this._rows = response.data;
        this._rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }
}
