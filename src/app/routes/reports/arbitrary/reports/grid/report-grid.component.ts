import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { IReport } from '../reports.interface';

import { ReportsService } from '../reports.service';
import { DialogFunctions } from '@app/core/dialog';
import { GridService } from '@app/shared/components/grid/grid.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-arbitrary-report-grid',
  templateUrl: './report-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedReport$ = new BehaviorSubject<IReport>(null);

  columns: Array<IGridColumn> = [
    { prop: 'id', maxWidth: 70 },
    { prop: 'name' },
    { prop: 'comment' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.reportsService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedReport$.value),
      enabled: combineLatestAnd([
        this.selectedReport$.map(Boolean),
        this.reportsService.canEdit$
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.selectedReport$.map(Boolean),
        this.reportsService.canDelete$
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.reportsService.canView$
    }
  ];

  dialog: string;
  reports: IReport[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private reportsService: ReportsService,
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

    this.fetch();

    this.actionSubscription = this.reportsService
      .getAction(ReportsService.MESSAGE_REPORT_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedReport$.next(this.selectedReport);
      });
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  get selectedReport(): IReport {
    return (this.reports || [])
      .find(group => this.selectedReport$.value && group.id === this.selectedReport$.value.id);
  }

  get selection(): Array<IReport> {
    const selectedReport = this.selectedReport;
    return selectedReport ? [ selectedReport ] : [];
  }

  onSelect(report: IReport): void {
    this.selectedReport$.next(report);
  }

  onEdit(report: IReport): void {
    this.routingService.navigate([ `${report.id}` ], this.route);
  }

  onRemove(): void {
    const { id: reportId } = this.selectedReport;
    this.reportsService.delete(reportId)
      .subscribe(() => {
        this.setDialog();
        this.selectedReport$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.routingService.navigate([ 'create' ], this.route);
  }

  private fetch(): void {
    this.reportsService.fetchAll().subscribe(reports => {
      this.reports = reports;
      this.cdRef.markForCheck();
    });
  }
}
