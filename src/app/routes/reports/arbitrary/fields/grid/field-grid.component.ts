import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { IReportField } from '../fields.interface';

import { FieldsService } from '../fields.service';
import { DialogFunctions } from '@app/core/dialog';
import { GridService } from '@app/shared/components/grid/grid.service';
import { RoutingService } from '@app/core/routing/routing.service';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-arbitrary-report-field-grid',
  templateUrl: './field-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedField$ = new BehaviorSubject<IReportField>(null);
  private reportId$ = new BehaviorSubject<number>(null);

  @Input() set reportId(id: number) {
    this.reportId$.next(id);
  }

  columns: Array<IGridColumn> = [
    { prop: 'id', maxWidth: 70 },
    { prop: 'name' },
    { prop: 'sortOrder' },
    { prop: 'systemName' },
    { prop: 'textWidth' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([
        this.reportId$.map(Boolean),
        this.fieldsService.canAdd$
      ]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedField$.value),
      enabled: combineLatestAnd([
        this.selectedField$.map(Boolean),
        this.fieldsService.canEdit$
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.selectedField$.map(Boolean),
        this.fieldsService.canDelete$
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: combineLatestAnd([
        this.reportId$.map(Boolean),
        this.fieldsService.canView$
      ])
    }
  ];

  dialog: string;
  fields: IReportField[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private fieldsService: FieldsService,
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

    this.actionSubscription = this.fieldsService
      .getAction(FieldsService.MESSAGE_FIELD_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedField$.next(this.selectedField);
      });
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  get reportId(): number {
    return this.reportId$.value;
  }

  get selectedField(): IReportField {
    return (this.fields || [])
      .find(field => this.selectedField$.value && field.id === this.selectedField$.value.id);
  }

  get selection(): Array<IReportField> {
    const selectedField = this.selectedField;
    return selectedField ? [ selectedField ] : [];
  }

  onSelect(field: IReportField): void {
    this.selectedField$.next(field);
  }

  onEdit(field: IReportField): void {
    this.routingService.navigate([ `${this.reportId}/fields/${field.id}` ], this.route);
  }

  onRemove(): void {
    const { id: fieldId } = this.selectedField;
    this.fieldsService.delete(this.reportId, fieldId)
      .subscribe(() => {
        this.setDialog();
        this.selectedField$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.routingService.navigate([ `${this.reportId}/fields/create` ], this.route);
  }

  private fetch(): void {
    this.fieldsService.fetchAll(this.reportId).subscribe(fields => {
      this.fields = fields;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this.fields = [];
    this.cdRef.markForCheck();
  }
}