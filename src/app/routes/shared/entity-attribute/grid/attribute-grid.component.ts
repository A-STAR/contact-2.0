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
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute } from '../attribute.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd, addGridLabel } from '@app/core/utils';
import { DateTimeRendererComponent } from '@app/shared/components/grids/renderers';

@Component({
  selector: 'app-entity-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  host: { class: 'full-height' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @Input('entityTypeId') set entityTypeId(entityTypeId: number) {
    this.entityTypeId$.next(entityTypeId);
  }

  @Input('entityId') set entityId(entityId: number){
    this.entityId$.next(entityId);
  }

  private entityTypeId$ = new BehaviorSubject<number>(null);
  private entityId$ = new BehaviorSubject<number>(null);
  private entitySubscription: Subscription;

  columns: Array<ISimpleGridColumn<IAttribute>> = [
    {
      prop: 'code', minWidth: 50, maxWidth: 80,
    },
    {
      prop: 'name', minWidth: 150, maxWidth: 200, isGroup: true,
    },
    {
      prop: 'value', valueTypeKey: 'typeCode', minWidth: 100, maxWidth: 200,
      valueTypeParams: {
        dictCode: row => row.dictNameCode
      },
    },
    {
      prop: 'userFullName', minWidth: 100, maxWidth: 200,
    },
    {
      prop: 'changeDateTime', minWidth: 100, maxWidth: 200,
      renderer: DateTimeRendererComponent,
    },
    {
     prop: 'comment', minWidth: 80, maxWidth: 150,
    },
  ].map(addGridLabel('widgets.attribute.grid'));

  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  toolbarItems: IToolbarItem[];

  dialog: 'edit';

  rows: IAttribute[];

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
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

  get persistenceKey(): string {
    return `[grid] attributes/${this.entityTypeId}/${this.entityId}`;
  }

  get selectedAttributeCode$(): Observable<number> {
    return this.selectedAttribute$.map(attribute => attribute.code);
  }

  onRowDblClick(row: IAttribute): void {
    if (row) {
      this.selectedAttribute$.next(row);
      this.canEdit$
        .pipe(first())
        .filter(Boolean)
        .subscribe(() => {
          this.setDialog('edit');
          this.cdRef.markForCheck();
        });
    }
  }

  onRowSelect(rows: IAttribute[]): void {
    const [ row ] = rows;
    this.selectedAttribute$.next(row);
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
          this.selectedAttribute$.map(attribute => attribute && !!attribute.version && attribute.disabledValue !== 1)
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
      this.rows = attributes;
      this.removeSelection();
      this.cdRef.markForCheck();
    });

  }
}
