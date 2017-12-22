import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute } from '../attribute.interface';
import { IGridWrapperTreeColumn } from '../../../../components/gridtree-wrapper/gridtree-wrapper.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { GridTreeWrapperComponent } from '../../../../../shared/components/gridtree-wrapper/gridtree-wrapper.component';

import { combineLatestAnd } from '../../../../../core/utils/helpers';
import { DialogFunctions } from '../../../../../core/dialog';
import { makeKey } from '../../../../../core/utils';
import { of } from 'rxjs/observable/of';

const label = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-entity-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  @ViewChild(GridTreeWrapperComponent) grid: GridTreeWrapperComponent<IAttribute>;

  @Input() entityTypeId$: Observable<number>;
  @Input() entityId$: Observable<number>;

  private entitySubscription: Subscription;

  private _columns: Array<IGridWrapperTreeColumn<IAttribute>> = [
    {
      label: label('code'),
      prop: 'code',
    },
    {
      label: label('name'),
      prop: 'name'
    },
    {
      label: label('value'),
      valueGetter: (_, data) => this.valueConverterService.deserialize(data).value,
    },
    {
      label: label('userFullName'),
      prop: 'userFullName',
    },
    {
      label: label('changeDateTime'),
      prop: 'changeDateTime',
      valueFormatter: value => this.valueConverterService.ISOToLocalDateTime(value as string) || '',
    },
    {
      label: label('comment'),
      prop: 'comment',
    },
  ];

  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  toolbarItems: IToolbarItem[];

  dialog: 'edit';

  rows: IGridTreeRow<Partial<IAttribute>>[] = [];

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
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

  get columns(): IGridTreeColumn<IAttribute>[] {
    return this._columns;
  }

  get selectedAttributeCode$(): Observable<number> {
    return this.selectedAttribute$.map(attribute => attribute.code);
  }

  onRowDblClick(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
    this.canEdit$
      .pipe(first())
      .filter(Boolean)
      .subscribe(() => {
        this.setDialog('edit');
        this.cdRef.markForCheck();
      });
  }

  onRowSelect(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
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
    this.router.navigate([`${this.router.url}/${this.selectedAttribute$.value.code}/versions`]);
  }

  idGetter = (row: IGridTreeRow<IAttribute>) => row.data.code;

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
    this.grid.gridTree.gridTreeService.removeSelection();
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
