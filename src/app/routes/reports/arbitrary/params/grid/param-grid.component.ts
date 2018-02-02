import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { IReportParam } from '../params.interface';

import { ParamsService } from '../params.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-arbitrary-report-param-grid',
  templateUrl: './param-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedParam$ = new BehaviorSubject<IReportParam>(null);
  private reportId$ = new BehaviorSubject<number>(null);

  @Input() set reportId(id: number) {
    this.reportId$.next(id);
  }

  columns: Array<IGridColumn> = [
    { prop: 'id', maxWidth: 70 },
    { prop: 'name' },
    { prop: 'paramTypeCode', dictCode: UserDictionariesService.DICTIONARY_REPORT_PARAM_TYPE_CODE },
    { prop: 'sortOrder' },
    { prop: 'systemName' },
    { prop: 'isMandatory', renderer: 'checkboxRenderer' },
    { prop: 'multiSelect', renderer: 'checkboxRenderer' }
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([
        this.reportId$.map(Boolean),
        this.paramsService.canAdd$
      ]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedParam$.value),
      enabled: combineLatestAnd([
        this.selectedParam$.map(Boolean),
        this.paramsService.canEdit$
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.selectedParam$.map(Boolean),
        this.paramsService.canDelete$
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: combineLatestAnd([
        this.reportId$.map(Boolean),
        this.paramsService.canView$
      ])
    }
  ];

  dialog: string;
  params: IReportParam[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paramsService: ParamsService,
    private gridService: GridService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.reportId$.subscribe(id => id ? this.fetch() : this.clear());

    this.actionSubscription = this.paramsService
      .getAction(ParamsService.MESSAGE_PARAM_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedParam$.next(this.selectedParam);
      });
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  get reportId(): number {
    return this.reportId$.value;
  }

  get selectedParam(): IReportParam {
    return (this.params || [])
      .find(param => this.selectedParam$.value && param.id === this.selectedParam$.value.id);
  }

  get selection(): Array<IReportParam> {
    const selectedParam = this.selectedParam;
    return selectedParam ? [ selectedParam ] : [];
  }

  onSelect(param: IReportParam): void {
    this.selectedParam$.next(param);
  }

  onEdit(param: IReportParam): void {
    this.routingService.navigate([ `${this.reportId}/params/${param.id}` ], this.route);
  }

  onRemove(): void {
    const { id: paramId } = this.selectedParam;
    this.paramsService.delete(this.reportId, paramId)
      .subscribe(() => {
        this.setDialog();
        this.selectedParam$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.routingService.navigate([ `${this.reportId}/params/create` ], this.route);
  }

  private fetch(): void {
    this.paramsService.fetchAll(this.reportId).subscribe(params => {
      this.params = params;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this.params = [];
    this.cdRef.markForCheck();
  }
}
