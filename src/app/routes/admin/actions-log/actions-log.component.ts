import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, OnDestroy, ViewChild, OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { flatMap, filter, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IActionLog } from './actions-log.interface';
import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IContextMenuItem } from '@app/shared/components/grid/grid.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IQuery } from '@app/shared/components/qbuilder2/qbuilder2.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { ActionsLogService } from './actions-log.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';
import { DownloaderComponent } from '@app/shared/components/downloader/downloader.component';
import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { timeToHourMinSec } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-actions-log',
  templateUrl: './actions-log.component.html',
})
export class ActionsLogComponent implements  OnDestroy, OnInit, AfterViewInit {
  @ViewChild('downloader') downloader: DownloaderComponent;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  hasViewPermission$: Observable<boolean>;
  permissionSub: Subscription;

  query$ = new BehaviorSubject<IQuery>(null);
  isFormReady$ = new BehaviorSubject<boolean>(false);

  rows: IActionLog[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  controls: IDynamicFormItem[];
  data: any;
  titlebar: ITitlebar = {
    title: 'actionsLog.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_SEARCH,
        enabled: this.isFilterValid,
        action: () => this.doSearch(),
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL,
        enabled: this.isFilterValid,
        action: () => this.doExport(),
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_MASS,
        enabled: of(true),
        title: 'Массовые операции',
        children: [
          {
            title: 'widgets.mass.outsourcing.send.title',
            action: () => alert('Children 1 fired!'),
            enabled: of(true)
          },
          {
            title: 'widgets.mass.outsourcing.exclude.title',
            action: () => alert('Children 2 fired!'),
            enabled: of(false)
          },
          {
            title: 'widgets.mass.outsourcing.return.title',
            enabled: of(true),
            children: [
              {
                title: 'Sub child 1',
                action: () => alert('Sub child 1 of child 3 fired!'),
                enabled: of(true)
              },
              {
                title: 'Sub child 2',
                action: () => alert('Sub child 2 of child 3 fired!'),
                enabled: of(false)
              },
              {
                title: 'Sub child 3',
                action: () => alert('Sub child 3 of child 3 fired!'),
                enabled: of(true)
              },
            ],
          },
        ]
      },
    ],
  };

  contextMenuOptions: IContextMenuItem[] = [
    {
      action: 'openDebtCardByDebtor',
      label: 'default.grid.actions.openDebtCardByDebtor',
      enabled: of(true),
      params: [ 'personId' ],
    }
  ];

  constructor(
    private actionsLogService: ActionsLogService,
    private cdRef: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.hasViewPermission$ = this.userPermissionsService.has('ACTION_LOG_VIEW');
  }

  ngOnInit(): void {
    const start = moment().startOf('month').toDate();
    const end = moment().endOf('month').toDate();

    this.data = {
      startDate: start,
      // startTime should be preset to '00:00:00'
      startTime: start,
      endDate: end,
      // endTime should be preset '23:59:59'
      endTime: end,
    };

    this.controls = [
      {
        children: [
          {
            controlName: 'startDate',
            label: 'default.dateTimeRange.from',
            required: true,
            type: 'datepicker',
            width: 4,
          },
          {
            controlName: 'startTime',
            label: null,
            required: true,
            type: 'timepicker',
            width: 2,
          },
          {
            controlName: 'endDate',
            label: 'default.dateTimeRange.to',
            required: true,
            type: 'datepicker',
            width: 4,
          },
          {
            controlName: 'endTime',
            label: null,
            required: true,
            type: 'timepicker',
            width: 2,
          },
        ],
      },
      {
        children: [
          {
            controlName: 'employees',
            label: 'actionsLog.filter.employees.title',
            placeholder: 'actionsLog.filter.employees.placeholder',
            filterType: 'users',
            type: 'dialogmultiselectwrapper',
            width: 6,
          },
          {
            controlName: 'actionsTypes',
            label: 'actionsLog.filter.actionsTypes.title',
            placeholder: 'actionsLog.filter.actionsTypes.placeholder',
            filterType: 'actions',
            type: 'dialogmultiselectwrapper',
            width: 6,
          },
        ],
      },
    ];
  }

  ngAfterViewInit(): void {
    this.permissionSub = this.hasViewPermission$
      .subscribe(canView => {
        if (!canView) {
          this.rows = [];
          this.rowCount = 0;
          this.notificationsService.permissionError().entity('entities.actionsLog.gen.plural').dispatch();
        } else {
          // load data
          if ((this.grid && this.grid.grid as any).gridOptions) {
            this.doSearch();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.permissionSub.unsubscribe();
  }

  get isFilterValid(): Observable<boolean> {
    return this.isFormReady$
      .pipe(
        filter(Boolean),
        tap(v => console.log('ready', v)),
        flatMap(isReady => isReady && this.form.form.statusChanges.map(status => status === 'VALID'))
      );
  }

  get queryBuilderOpen$(): Observable<boolean> {
    return this.query$.map(query => query !== null);
  }

  getFilters(): FilterObject {
    const value = this.form.serializedValue;
    // log('formValue', value);
    const endTime = timeToHourMinSec(value.endTime);
    const startTime = timeToHourMinSec(value.startTime);

    const endDate = moment(value.endDate).set(endTime).toISOString();
    const startDate = moment(value.startDate).set(startTime).toISOString();

    const actionsCodes = value.actionsTypes;
    const employeeIds = value.employees;

    return FilterObject.create()
      .and()
      .addFilter(
        FilterObject.create()
          .setName('createDateTime')
          .betweenOperator()
          .setValues([startDate, endDate]),
      )
      .addFilter(
        FilterObject.create()
          .setName('typeCode')
          .inOperator()
          .setValues(actionsCodes),
      )
      .addFilter(
        FilterObject.create()
          .setName('userId')
          .inOperator()
          .setValues(employeeIds),
      );
  }

  doSearch(): void {
    const filters = this.getCombinedFilters();
    const params = (<any>this.grid.grid).grid.getRequestParams();
    this.actionsLogService.fetch(filters, params)
      .subscribe((response: IAGridResponse<IActionLog>) => {
        this.rows = [...response.data];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  private doExport(): void {
    const filters = this.getCombinedFilters();
    const grid = (<any>this.grid.grid);
    const params = grid.grid.getRequestParams();

    if (grid) {
      const columns = grid.grid.getExportableColumns();
      const request = grid.grid.buildRequest(params, filters);
      // NOTE: no paging in export, so remove it from the request
      const { paging, ...rest } = request;
      const body = { columns, ...rest };
      this.downloader.download(body);
    }
  }

  // openQueryBuilder(): void {
  //   this.query$.next({
  //     filters: this.getCombinedFilters(),
  //     columns: [].concat(this.grid.columns)
  //   });
  // }

  // closeQueryBuilder(): void {
  //   this.query$.next(null);
  // }

  private getCombinedFilters(): FilterObject {
    const filters = this.getFilters();
    return filters.addFilter((this.grid as ActionGridComponent<any>).getFilters());
  }
}
