import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IReportField } from '../fields.interface';

import { FieldsService } from '../fields.service';
import { DialogFunctions } from '@app/core/dialog';
import { RoutingService } from '@app/core/routing/routing.service';

import { addGridLabel, combineLatestAnd } from '@app/core/utils';

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

  columns: Array<ISimpleGridColumn<IReportField>> = [
    { prop: 'id', maxWidth: 70 },
    { prop: 'name' },
    { prop: 'sortOrder' },
    { prop: 'systemName' },
    { prop: 'textWidth' },
  ].map(addGridLabel('modules.reports.arbitrary.fields.grid'));

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: combineLatestAnd([
        this.reportId$.map(Boolean),
        this.fieldsService.canEdit$
      ]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => this.onEdit(this.selectedField$.value),
      enabled: combineLatestAnd([
        this.selectedField$.map(Boolean),
        this.fieldsService.canEdit$
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.setDialog('remove'),
      enabled: combineLatestAnd([
        this.selectedField$.map(Boolean),
        this.fieldsService.canEdit$
      ])
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch(),
      enabled: combineLatestAnd([
        this.reportId$.map(Boolean),
        this.fieldsService.canEdit$
      ])
    }
  ];

  dialog: string;
  fields: IReportField[] = [];

  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private fieldsService: FieldsService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {
    super();
  }

  ngOnInit(): void {
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

  onSelect([ field ]: IReportField[]): void {
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
    this.fieldsService.fetchAll(this.reportId)
      .map(fields => fields.sort((f1, f2) => f1.sortOrder - f2.sortOrder))
      .subscribe(fields => {
        this.fields = fields;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.fields = [];
    this.cdRef.markForCheck();
  }
}
