import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IReport } from '../reports.interface';
import { ITitlebar, TitlebarItemTypeEnum } from '@app/shared/components/titlebar/titlebar.interface';

import { DialogFunctions } from '@app/core/dialog';
import { GridService } from '@app/shared/components/grid/grid.service';
import { ReportsService } from '../reports.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-arbitrary-report-grid',
  templateUrl: './report-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedReport$ = new BehaviorSubject<IReport>(null);
  private canCreate$ = new BehaviorSubject<boolean>(null);

  @Output() select = new EventEmitter<IReport>();

  columns: Array<IGridColumn> = [
    { prop: 'id', maxWidth: 70 },
    { prop: 'name' },
    { prop: 'comment' },
  ];

  titlebar: ITitlebar = {
    title: 'modules.reports.arbitrary.title',
    items: [
      {
        type: TitlebarItemTypeEnum.BUTTON_ADD,
        enabled: this.reportsService.canAdd$,
        action: () => this.onAdd()
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_EDIT,
        action: () => this.onEdit(this.selectedReport$.value),
        enabled: combineLatestAnd([
          this.selectedReport$.map(Boolean),
          this.reportsService.canEdit$
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DELETE,
        action: () => this.setDialog('remove'),
        enabled: combineLatestAnd([
          this.selectedReport$.map(Boolean),
          this.reportsService.canDelete$
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_DOWNLOAD_EXCEL,
        action: () => this.setDialog('create'),
        enabled: combineLatestAnd([
          this.selectedReport$.map(Boolean),
          this.reportsService.canCreate$,
          this.canCreate$
        ])
      },
      {
        type: TitlebarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetch(),
        enabled: this.reportsService.canView$
      }
    ]
  };

  dialog: string;
  reports: IReport[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private reportsService: ReportsService,
    private gridService: GridService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private valueConverterService: ValueConverterService
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

    this.selectedReport$
      .subscribe(report => this.select.emit(report));

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

  set canCreate(canCreate: boolean) {
    this.canCreate$.next(canCreate);
  }

  get selectedReport(): IReport {
    return (this.reports || [])
      .find(report => this.selectedReport$.value && report.id === this.selectedReport$.value.id);
  }

  get selectedReportId(): number {
    return this.selectedReport && this.selectedReport.id;
  }

  get selectedReportName(): string {
    return `${this.selectedReport.name}_${this.valueConverterService.toLocalDateTime(new Date())}`;
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
