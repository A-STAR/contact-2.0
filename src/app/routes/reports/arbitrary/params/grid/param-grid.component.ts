import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Toolbar, ToolbarItemType } from '@app/shared/components/toolbar/toolbar.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IReportParam } from '../params.interface';

import { ParamsService } from '../params.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { DialogFunctions } from '@app/core/dialog';
import { addGridLabel, combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-arbitrary-report-param-grid',
  templateUrl: './param-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParamGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedParam$ = new BehaviorSubject<IReportParam>(null);
  private reportId$ = new BehaviorSubject<number>(null);
  private params$ = new BehaviorSubject<IReportParam[]>([]);

  @Input() set reportId(id: number) {
    this.reportId$.next(id);
  }

  columns: Array<ISimpleGridColumn<IReportParam>> = [
    { prop: 'id', maxWidth: 70 },
    { prop: 'name' },
    { prop: 'paramTypeCode', dictCode: UserDictionariesService.DICTIONARY_REPORT_PARAM_TYPE_CODE },
    { prop: 'sortOrder' },
    { prop: 'systemName' },
    { prop: 'isMandatory', renderer: TickRendererComponent },
    { prop: 'multiSelect', renderer: TickRendererComponent }
  ].map(addGridLabel('modules.reports.arbitrary.params.grid'));

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        enabled: combineLatestAnd([
          this.reportId$.map(Boolean),
          this.paramsService.canEdit$
        ]),
        action: () => this.onAdd()
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selectedParam$.value),
        enabled: combineLatestAnd([
          this.selectedParam$.map(Boolean),
          this.paramsService.canEdit$
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.selectedParam$.map(Boolean),
          this.paramsService.canEdit$
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: combineLatestAnd([
          this.reportId$.map(Boolean),
          this.paramsService.canEdit$
        ])
      }
    ]
  };

  dialog: string;

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private paramsService: ParamsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    super();
  }

  ngOnInit(): void {
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

  get rows$(): Observable<IReportParam[]> {
    return this.params$;
  }

  get reportId(): number {
    return this.reportId$.value;
  }

  get params(): IReportParam[] {
    return this.params$.value;
  }

  get selectedParam(): IReportParam {
    return (this.params$.value || [])
      .find(param => this.selectedParam$.value && param.id === this.selectedParam$.value.id);
  }

  get selection(): Array<IReportParam> {
    const selectedParam = this.selectedParam;
    return selectedParam ? [ selectedParam ] : [];
  }

  onSelect([ param ]: IReportParam[]): void {
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
    this.paramsService.fetchAll(this.reportId)
      .map(params => params.sort((p1, p2) => p1.sortOrder - p2.sortOrder))
      .subscribe(params => {
        this.params$.next(params);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.params$.next([]);
    this.cdRef.markForCheck();
  }
}
