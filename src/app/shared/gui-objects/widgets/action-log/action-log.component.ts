import {
  AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component,
  OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IDebtorActionLog } from './action-log.interface';
import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form.interface';
import { ActionLogService } from './action-log.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserConstantsService } from '../../../../core/user/constants/user-constants.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { FilterObject } from '../../../../shared/components/grid2/filter/grid-filter';
import { Grid2Component } from '../../../../shared/components/grid2/grid2.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-action-log',
  styleUrls: [ './action-log.component.scss' ],
  templateUrl: './action-log.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DebtorActionLogComponent implements AfterViewInit, OnDestroy {
  static COMPONENT_NAME = 'DebtorActionLogComponent';

  @ViewChild(Grid2Component) grid: Grid2Component;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private personId = (this.route.params as any).value.id || null;
  private canViewSub: Subscription;
  private constantSub: Subscription;

  private actionLogDays = 0;
  private hasViewPermission$: Observable<boolean>;

  data: any = {};
  controls: IDynamicFormControl[] = [
    { label: 'Начало', controlName: 'startDate', type: 'datepicker', displayTime: true, width: 5 },
    { label: 'Окончание', controlName: 'endDate', type: 'datepicker', displayTime: true, width: 5 },
    {
      label: 'Искать',
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
    private route: ActivatedRoute,
    private notifications: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.constantSub = this.userConstantsService.get('Person.ActionLog.Days')
    .subscribe(( actionLogDays ) => {
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
          this.notifications.error('errors.default.read.403').entity('entities.actionsLog.gen.plural').dispatch();
        } else {
          // load data
          if (this.grid.gridOptions.api) {
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
