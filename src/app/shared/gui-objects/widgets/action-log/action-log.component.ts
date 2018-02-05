import {
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IDebtorActionLog } from './action-log.interface';
import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form.interface';

import { ActionLogService } from './action-log.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.actionLog.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-action-log',
  styleUrls: [ './action-log.component.scss' ],
  templateUrl: './action-log.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DebtorActionLogComponent implements AfterViewInit, OnDestroy {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() personId: number;

  private canViewSub: Subscription;
  private constantSub: Subscription;

  private actionLogDays = 0;
  private hasViewPermission$: Observable<boolean>;

  data: any = {};
  controls: IDynamicFormControl[] = [
    { label: labelKey('startDate'), controlName: 'startDate', type: 'datetimepicker', width: 5 },
    { label: labelKey('endDate'), controlName: 'endDate', type: 'datetimepicker', width: 5 },
    {
      label: labelKey('searchBtn'),
      controlName: 'searchBtn',
      type: 'button',
      iconCls: 'fa-search',
      width: 2,
      action: () => this.onRequest(),
    },
  ];

  rows: IDebtorActionLog[] = [];
  rowCount = 0;

  constructor(
    private actionLogService: ActionLogService,
    private cdRef: ChangeDetectorRef,
    private notifications: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.constantSub = this.userConstantsService.get('Person.ActionLog.Days')
      .subscribe(actionLogDays => {
        this.actionLogDays = actionLogDays && actionLogDays.valueN || 0;
      });
    this.hasViewPermission$ = this.userPermissionsService.has('PERSON_ACTION_LOG_VIEW');
  }

  ngAfterViewInit(): void {
    this.canViewSub = this.hasViewPermission$
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.rows = [];
          this.rowCount = 0;
          this.notifications.permissionError().entity('entities.actionsLog.gen.plural').dispatch();
        } else {
          // load data
          if (this.grid && this.grid.gridOptions) {
            this.onRequest();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSub.unsubscribe();
    this.constantSub.unsubscribe();
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    filters.addFilter(this.getFormFilters());
    const params = this.grid.getRequestParams();
    this.actionLogService.fetch(this.personId, filters, params)
      .subscribe((response: IAGridResponse<IDebtorActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  getRowNodeId(actionLog: IDebtorActionLog): number {
    return actionLog.id;
  }

  getFormFilters(): FilterObject {
    const filterObject = FilterObject.create().and();
    const { startDate, endDate } = this.form.value;

    if (!startDate && !endDate && this.actionLogDays) {
      const mStartDate = moment().subtract(this.actionLogDays, 'day')
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      // pass the new value to the control
      this.data = { startDate: mStartDate.toDate() };
      this.cdRef.markForCheck();

      return filterObject
        .addFilter(
          FilterObject.create()
            .setName('createDateTime')
            .setOperator('>=')
            .setValues(mStartDate.toISOString())
        );
    }

    if (!startDate && endDate) {
      return filterObject
        .addFilter(
          FilterObject.create()
            .setName('createDateTime')
            .setOperator('<=')
            .setValues(endDate.toISOString())
        );
    }

    if (startDate && !endDate) {
      return filterObject
        .addFilter(
          FilterObject.create()
            .setName('createDateTime')
            .setOperator('>=')
            .setValues(startDate.toISOString())
        );
    }

    return !startDate && !endDate
      ? null
      : filterObject
        .addFilter(
          FilterObject.create()
            .setName('createDateTime')
            .betweenOperator()
            .setValues([ startDate.toISOString(), endDate.toISOString() ])
        );
  }

}
