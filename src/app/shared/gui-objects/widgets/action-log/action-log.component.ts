import { ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
// import { Subscription } from 'rxjs/Subscription';
// import { ActivatedRoute } from '@angular/router';

import { IDebtorActionLog } from './action-log.interface';
// import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';

// import { ActionLogService } from './action-log.service';

import { GridComponent } from '../../../../shared/components/grid/grid.component';
// import { Grid2Component } from '../../../../shared/components/grid2/grid2.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-action-log',
  templateUrl: './action-log.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DebtorActionLogComponent {
  static COMPONENT_NAME = 'DebtorActionLogComponent';

  // @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild(GridComponent) grid: GridComponent;

  // private personId = (this.route.params as any).value.id || null;
  // private canViewSubscription: Subscription;

  columns: Array<any> = [
    { prop: 'fullName' },
    { prop: 'createDateTime', maxWidth: 110, renderer: 'dateTimeRenderer' },
    // { prop: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_TYPE },
    { prop: 'guiObject' },
    { prop: 'typeCode' },
    { prop: 'dsc' },
    { prop: 'machine' },
  ];

  rows: IDebtorActionLog[] = [];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    // private actionLogService: ActionLogService,
    // private route: ActivatedRoute,
  ) {}

  onRequest(): void {
    // const filters = this.grid.getFilters();
    // const params = this.grid.getRequestParams();
    // this.actionLogService.fetch(filters, params)
    //   .subscribe((response: IAGridResponse<IDebtorActionLog>) => {
    //     this.rows = [...response.data];
    //     this.rowCount = response.total;
    //     this.cdRef.markForCheck();
    //   });
  }

  onSelect(actionLog: IDebtorActionLog): void {
    console.log(actionLog);
    this.cdRef.markForCheck();
  }

  getRowNodeId(actionLog: IDebtorActionLog): number {
    return actionLog.id;
  }

}
