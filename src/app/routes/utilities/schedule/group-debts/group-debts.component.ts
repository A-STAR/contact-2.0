import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGroupDebt } from './group-debts.interface';

import { GroupDebtsService } from './group-debts.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  selector: 'app-group-debts',
  templateUrl: './group-debts.component.html',
  styleUrls: ['./group-debts.component.scss'],
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDebtsComponent implements OnInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGroupDebt>;

  rowIdKey = 'debtId';
  rowCount = 0;
  rows: any[] = [];

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupDebtsService: GroupDebtsService
  ) { }

  ngOnInit(): void {

  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const groupId = filters.get('groupId');
    if (groupId && groupId.length) {
      const params = this.grid.getRequestParams();
      this.groupDebtsService
        .fetch(groupId[0], filters, params)
        .subscribe((response: IAGridResponse<IGroupDebt>) => {
          this.rows = [...response.data];
          this.rowCount = response.total;
          this.cdRef.markForCheck();
        });
    }
  }

}
