import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDynamicFormConfig, IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGroup } from '../group.interface';
import { IGroupDebt } from './group-debts.interface';

import { GroupDebtsService } from './group-debts.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.groups.groupObjectDebts');

@Component({
  selector: 'app-group-debts',
  templateUrl: './group-debts.component.html',
})
export class GroupDebtsComponent implements OnInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  groupId: number;
  rowCount = 0;
  rows: any[] = [];

  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.groupObjectDebts.filter'
  };

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupDebtsService: GroupDebtsService
  ) { }

  ngOnInit(): void {
    this.controls = this.getControls();
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

  onGroupSelect(group: IGroup): void {
    if (group) {
      this.groupId = group.id;
    }
  }

  private getControls(): IDynamicFormControl[] {
    return [
      {
        type: 'dialogmultiselectwrapper',
        controlName: 'groups',
        filterType: 'entityGroups',
        filterParams: { entityTypeId: 19, isManual: false },
        onChange: (group) => this.onGroupSelect(group)
      }
    ];
  }
}
