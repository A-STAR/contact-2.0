import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute } from '@app/shared/gui-objects/widgets/entity-attribute/attribute.interface';
import { IAGridWrapperTreeColumn } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IGridTreeRow } from './gridtree.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '@app/shared/gui-objects/widgets/entity-attribute/attribute.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DialogFunctions } from '@app/core/dialog';
import { makeKey, combineLatestAnd, TYPE_CODES } from '@app/core/utils';
import { of } from 'rxjs/observable/of';

const label = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-entity-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input('entityTypeId') set entityTypeId(entityTypeId: number) {
    this._entityTypeId = entityTypeId;
    this.entityTypeId$.next(entityTypeId);
  }

  @Input('entityId') set entityId(entityId: number){
    this._entityId = entityId;
    this.entityId$.next(entityId);
  }

  private _entityTypeId: number;
  private _entityId: number;
  private entityTypeId$ = new BehaviorSubject<number>(null);
  private entityId$ = new BehaviorSubject<number>(null);
  private entitySubscription: Subscription;

  private _columns: Array<IAGridWrapperTreeColumn<IAttribute>> = [
    {
      dataType: TYPE_CODES.STRING, name: 'code', isDataPath: true,
    },
    {
      dataType: TYPE_CODES.STRING, name: 'name',
    },
    {
      dataType: TYPE_CODES.STRING, name: 'value',
      valueGetter: row => this.valueConverterService.deserialize(row.data).value,
    },
    {
      dataType: TYPE_CODES.STRING, name: 'userFullName',
    },
    {
      dataType: TYPE_CODES.STRING, name: 'changeDateTime',
      valueFormatter: row => this.valueConverterService.ISOToLocalDateTime(row.value) || '',
    },
    {
      dataType: TYPE_CODES.STRING, name: 'comment',
    },
  ].map(col => ({ ...col, label: label(col.name)}));

  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  toolbarItems: IToolbarItem[];

  dialog: 'edit';

  rows: IGridTreeRow<Partial<IAttribute>>[] = [];

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService
  ) {
    super();
  }

  ngOnInit(): void {

    this.toolbarItems = this.getToolbarItems();

    this.entitySubscription = combineLatest(this.entityTypeId$, this.entityId$)
      .pipe(
        flatMap(([ entityTypeId, entityId ]) =>
          this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', entityTypeId)
            .map(canView => [entityTypeId, entityId, canView])
      ))
      .subscribe(([ entityTypeId, entityId, canView ]) => {
        if (canView && entityTypeId && entityId) {
          this.fetch();
        } else {
          this.rows = [];
          this.cdRef.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.entitySubscription.unsubscribe();
  }

  get columns(): IAGridWrapperTreeColumn<IAttribute>[] {
    return this._columns;
  }

  get selectedAttributeCode$(): Observable<number> {
    return this.selectedAttribute$.map(attribute => attribute.code);
  }

  onRowDblClick(row: IGridTreeRow<IAttribute>): void {
    if (row && row.data) {
      this.selectedAttribute$.next(row.data);
      this.canEdit$
        .pipe(first())
        .filter(Boolean)
        .subscribe(() => {
          this.setDialog('edit');
          this.cdRef.markForCheck();
        });
    }
  }

  onRowSelect(row: IGridTreeRow<IAttribute>): void {
    this.selectedAttribute$.next(row.data);
  }

  onEditDialogSubmit(attribute: Partial<IAttribute>): void {
    this.setDialog();
    combineLatest(this.entityTypeId$, this.entityId$)
      .pipe(
        flatMap(([entityTypeId, entityId]) =>
          this.attributeService.update(entityTypeId, entityId, this.selectedAttribute$.value.code, attribute)
        ),
        first(),
      )
      .subscribe(() => {
        this.fetch();
        this.cdRef.markForCheck();
      });
  }

  onVersionClick(): void {
    this.routingService.navigate([ `${this.selectedAttribute$.value.code}/versions` ], this.route);
  }

  private get canEdit$(): Observable<boolean> {
    return  this.entityTypeId$.switchMap(entityTypeId =>
      combineLatestAnd([
        this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', entityTypeId),
        this.selectedAttribute$.map(attribute => attribute && !attribute.disabledValue)
      ])
    );
  }

  private convertToGridTreeRow(attributes: IAttribute[]): IGridTreeRow<IAttribute>[] {
    return attributes.map(attribute => {
      const { children, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      return hasChildren
        ? { data: rest, children: this.convertToGridTreeRow(children), isExpanded: true }
        : { data: rest };
    });
  }

  private getToolbarItems(): IToolbarItem[] {
    return [
      {
        type: ToolbarItemTypeEnum.BUTTON_EDIT,
        action: () => this.setDialog('edit'),
        enabled: combineLatestAnd([
          this.entityTypeId$.flatMap(
            entityTypeId => this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', entityTypeId)
          ),
          this.selectedAttribute$.map(attribute => attribute && attribute.disabledValue !== 1)
        ])
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_VERSION,
        action: () => this.onVersionClick(),
        enabled: combineLatestAnd([
          this.entityTypeId$.flatMap(
            entityTypeId => this.userPermissionsService.contains('ATTRIBUTE_VERSION_VIEW_LIST', entityTypeId)
          ),
          // TODO:(i.lobanov) there is no version prop now on BE, uncomment when done
          this.selectedAttribute$.map(attribute => !!attribute && attribute.disabledValue !== 1)
          // this.selectedAttribute$.map(attribute => attribute && !!attribute.version && attribute.disabledValue !== 1)
        ])
      },
      {
        type: ToolbarItemTypeEnum.BUTTON_REFRESH,
        action: () => this.fetch(),
      },
    ];
  }

  private removeSelection(): void {
    this.selectedAttribute$.next(null);
  }

  private fetch(): void {
    combineLatest(this.entityTypeId$, this.entityId$)
    .pipe(
      flatMap(([ entityTypeId, entityId ]) => {
        return entityId && entityTypeId
          ? this.attributeService.fetchAll(entityTypeId, entityId)
          : of(null);
      }),
      first(),
    )
    .subscribe(attributes => {
      if (!attributes) {
        return;
      }
      this.rows = this.convertToGridTreeRow(attributes);
      this.removeSelection();
      this.cdRef.markForCheck();
    });

  }
}
