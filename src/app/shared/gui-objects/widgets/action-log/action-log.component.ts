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

import { ActionLogService } from './action-log.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-debtor-action-log',
  styleUrls: ['./action-log.component.scss'],
  templateUrl: './action-log.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class DebtorActionLogComponent implements AfterViewInit, OnDestroy {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() personId: number;

  private canViewSub: Subscription;
  private constantSub: Subscription;

  private hasViewPermission$: Observable<boolean>;

  rows: IDebtorActionLog[] = [];
  rowCount = 0;

  constructor(
    private actionLogService: ActionLogService,
    private cdRef: ChangeDetectorRef,
    private notifications: NotificationsService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngAfterViewInit(): void {
    this.constantSub = this.userConstantsService
      .get('Person.ActionLog.Days')
      .subscribe(actionLogDays => {
        this.setInitialDate(actionLogDays && actionLogDays.valueN);
      });
    this.hasViewPermission$ = this.userPermissionsService.has(
      'PERSON_ACTION_LOG_VIEW',
    );

    this.canViewSub = this.hasViewPermission$.subscribe(hasPermission => {
      if (!hasPermission) {
        this.rows = [];
        this.rowCount = 0;
        this.notifications
          .permissionError()
          .entity('entities.actionsLog.gen.plural')
          .dispatch();
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
    const params = this.grid.getRequestParams();
    this.actionLogService
      .fetch(this.personId, filters, params)
      .subscribe((response: IAGridResponse<IDebtorActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  setInitialDate(days: number): void {
    if (days && this.grid) {
      const mStartDate = moment()
        .subtract(days, 'day')
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      // pass the new value to the control
      const filterData = { startDate: mStartDate.toDate() };
      const filterForm = this.grid.getFiltersForm();
      if (filterForm) {
        filterForm.patchValue(filterData);
        this.cdRef.markForCheck();
      }
    }
  }
}
