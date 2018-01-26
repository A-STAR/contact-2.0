import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Inject,
} from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDynamicFormConfig, IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IFilterGroup } from '@app/core/filters/grid-filters.interface';
import { IGroupDebt } from './group-debts.interface';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { GroupDebtsService } from './group-debts.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { GridFiltersService } from '@app/core/filters/grid-filters.service';

@Component({
  selector: 'app-group-debts',
  templateUrl: './group-debts.component.html',
  styleUrls: ['./group-debts.component.scss'],
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GroupDebtsComponent implements OnInit {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<IGroupDebt>;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  groupId: number;
  rowCount = 0;
  rows: any[] = [];

  config: IDynamicFormConfig = {
    labelKey: 'widgets.groups.groupObjectDebts.filter'
  };

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorCardService: DebtorCardService,
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

  onDblClick(debt: IGroupDebt): void {
    this.debtorCardService.openByDebtId(debt.debtId);
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
        translationKey: 'widgets.groups.groupObjectDebts.filter',
        gridColumns: [
          { prop: 'id', minWidth: 50, maxWidth: 50 },
          { prop: 'name', minWidth: 300 }
        ],
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
