import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDynamicFormConfig, IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IFilterGroup } from '@app/core/filters/grid-filters.interface';
import { IGroupDebt } from './group-debts.interface';

import { GridFiltersService } from '@app/core/filters/grid-filters.service';
import { GroupDebtsService } from './group-debts.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-group-debts',
  templateUrl: './group-debts.component.html',
  styleUrls: ['./group-debts.component.scss'],
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDebtsComponent implements OnInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGroupDebt>;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  groupId: number;
  rowIdKey = 'debtId';
  rowCount = 0;
  rows: any[] = [];

  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.groupObjectDebts.filter'
  };

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupDebtsService: GroupDebtsService,
    private gridFiltersService: GridFiltersService,
    @Inject(GroupDebtsService.ENTITY_GROUP_ID) private entityTypeId: number[]
  ) { }

  ngOnInit(): void {
    this.gridFiltersService
      .fetchEntitiesGroups(this.entityTypeId, 0)
      .subscribe(groups => {
        this.controls = this.getControls(groups);
        this.cdRef.markForCheck();
      });
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

  onSearch(): void {
    const { groups } = this.form.serializedUpdates;
    this.groupId = groups;
    this.onRequest();
  }

  private getControls(groups: IFilterGroup[]): IDynamicFormControl[] {
    return [
      {
        controlName: 'groups',
        type: 'gridselect',
        gridColumns: [
          { prop: 'id', minWidth: 50, maxWidth: 50 },
          { prop: 'name', minWidth: 300 }
        ].map(addGridLabel('widgets.groups.groupObjectDebts.filter.grid')),
        gridRows: groups,
        gridLabelGetter: (row: IFilterGroup) => row.name,
        gridValueGetter: (row: IFilterGroup) => row.id,
        gridOnSelect: (row: IFilterGroup) => this.form.form.patchValue({ groups: row && row.id }),
        width: 5
      },
      {
        label: 'default.buttons.search',
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        width: 3,
        action: () => this.onSearch()
      }
    ];
  }

}
