import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IGroupDebt } from './group-debts.interface';

import { GroupDebtsService } from './group-debts.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  selector: 'app-group-debts',
  templateUrl: './group-debts.component.html',
})
export class GroupDebtsComponent implements OnInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  groupId: number;
  rowCount = 0;
  rows: any[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupDebtsService: GroupDebtsService
  ) { }

  ngOnInit(): void {
  }

  onRequest(): void {

    if (this.groupId) {
      const filters = this.grid.getFilters();
      const params = this.grid.getRequestParams();

      this.groupDebtsService
        .fetch(this.groupId, filters, params)
        .subscribe((response: IAGridResponse<IGroupDebt>) => {
          this.rows = [...response.data];
          this.rowCount = response.total;
          this.cdRef.markForCheck();
        });
    }
  }

}
