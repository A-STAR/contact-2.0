import {
  AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component,
  OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { IAGridResponse } from '../../../../shared/components/grid2/grid2.interface';
import { IDebtorActionLog } from './action-log.interface';
import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form.interface';

import { ActionLogService } from './action-log.service';
import { NotificationsService } from '../../../../core/notifications/notifications.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

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

  private personId = (this.route.params as any).value.id || null;
  private canViewSubscription: Subscription;
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
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    // Observable.combineLatest(
    //   this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PHONE_TYPE),
    //   this.phoneId ? this.userPermissionsService.has('PHONE_EDIT') : Observable.of(true),
    //   this.phoneId ? this.userPermissionsService.has('PHONE_COMMENT_EDIT') : Observable.of(true),
    //   this.phoneId ? this.phoneService.fetch(18, this.personId, this.phoneId) : Observable.of(null)
    // )
    // .take(1)
    // .subscribe(([ options, canEdit, canEditComment, phone ]) => {
    //   this.controls = [
    //     { label: labelKey('typeCode'), controlName: 'typeCode', type: 'select', required: true, options, disabled: !canEdit },
    //     { label: labelKey('phoneNumber'), controlName: 'phone', type: 'text', required: true, disabled: !canEdit },
    //     { label: labelKey('stopAutoSms'), controlName: 'stopAutoSms', type: 'checkbox', disabled: !canEdit },
    //     { label: labelKey('stopAutoInfo'), controlName: 'stopAutoInfo', type: 'checkbox', disabled: !canEdit },
    //     { label: labelKey('comment'), controlName: 'comment', type: 'textarea', disabled: !canEdit && !canEditComment },
    //   ];
    //   this.phone = phone;
    // });
    this.hasViewPermission$ = this.userPermissionsService.has('PERSON_ACTION_LOG_VIEW');
  }

  ngAfterViewInit(): void {
    this.canViewSubscription = this.hasViewPermission$
      .subscribe(hasPermission => {
        if (!hasPermission) {
          this.rows = [];
          this.rowCount = 0;
          this.notificationsService.error('errors.default.read.403').entity('entities.actionsLog.gen.plural').dispatch();
        } else {
          // this.actionLogService.getEmployeesAndActionTypes()
          //   .take(1)
          //   .subscribe();
          // load data
          if (this.grid.gridOptions.api) {
            this.onRequest();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.canViewSubscription.unsubscribe();
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
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

}
