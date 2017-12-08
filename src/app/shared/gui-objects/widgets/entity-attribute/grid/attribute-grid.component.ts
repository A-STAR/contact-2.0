import { ChangeDetectionStrategy, ChangeDetectorRef, Inject, Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { IAttribute } from '../attribute.interface';
import { IGridWrapperTreeColumn } from '../../../../components/gridtree-wrapper/gridtree-wrapper.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DialogFunctions } from '../../../../../core/dialog';

import { combineLatestAnd } from '../../../../../core/utils/helpers';
import { getRawValue, getDictCodeForValue } from '../../../../../core/utils/value';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-entity-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private _entityTypeId: number;
  private _entityId: number;

  private entitySubscription: Subscription;

  private _columns: Array<IGridWrapperTreeColumn<IAttribute>> = [
    {
      label: labelKey('code'),
      prop: 'code',
    },
    {
      label: labelKey('name'),
      prop: 'name'
    },
    {
      label: labelKey('value'),
      valueGetter: (_, data) => getRawValue(data),
      // TODO(d.maltsev): predefined formatting options e.g. 'date', 'datetime', etc.
      valueFormatter: (value, data) => {
        switch (data.typeCode) {
          case 2:
            return this.valueConverterService.ISOToLocalDate(value as string) || '';
          case 7:
            return this.valueConverterService.ISOToLocalDateTime(value as string) || '';
          default:
            return value as string;
        }
      },
      dictCode: data => getDictCodeForValue(data),
    },
    {
      label: labelKey('userFullName'),
      prop: 'userFullName',
    },
    {
      label: labelKey('changeDateTime'),
      prop: 'changeDateTime',
      valueFormatter: value => this.valueConverterService.ISOToLocalDateTime(value as string) || '',
    },
    {
      label: labelKey('comment'),
      prop: 'comment',
    },
  ];

  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('edit'),
      enabled: combineLatestAnd([
        this.entityTypeId$.flatMap(
          entityTypeId => this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId)
        ),
        this.selectedAttribute$.map(attribute => attribute && attribute.disabledValue !== 1)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_VERSION,
      action: () => this.onVersionClick(),
      enabled: combineLatestAnd([
        this.entityTypeId$.flatMap(
          entityTypeId => this.userPermissionsService.contains('ATTRIBUTE_VERSION_VIEW_LIST', this.entityTypeId)
        ),
        // TODO:(i.lobanov) there is no version prop now on BE, uncomment when done
        this.selectedAttribute$.map(attribute => !!attribute && attribute.disabledValue !== 1)
        // this.selectedAttribute$.map(attribute => attribute && !!attribute.version && attribute.disabledValue !== 1)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.entityTypeId && this.entityId && this.fetch(),
    },
  ];

  dialog: 'edit';

  rows: IGridTreeRow<Partial<IAttribute>>[] = [];

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    @Inject('entityTypeId$') private entityTypeId$: Observable<number>,
    @Inject('entityId$') private entityId$: Observable<number>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.entitySubscription = Observable.combineLatest(this.entityTypeId$, this.entityId$)
      .flatMap(([ entityTypeId, entityId ]) =>
        this.userPermissionsService.contains('ATTRIBUTE_VIEW_LIST', entityTypeId)
          .map(canView => [entityTypeId, entityId, canView])
      ).subscribe(([ entityTypeId, entityId, canView ]) => {
        this._entityTypeId = entityTypeId as number;
        this._entityId = entityId as number;

        if (canView && this.entityTypeId && this.entityId) {
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

  get entityTypeId(): number {
    return this._entityTypeId;
  }

  get entityId(): number {
    return this._entityId;
  }

  get columns(): Array<IGridTreeColumn<IAttribute>> {
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
    this.attributeService.update(this.entityTypeId, this.entityId, this.selectedAttribute$.value.code, attribute)
      .subscribe(() => {
        this.fetch();
        this.setDialog(null);
        this.cdRef.markForCheck();
      });
  }

  onVersionClick(): void {
    this.router.navigate([ `${this.router.url}/versions` ]);
  }

  idGetter = (row: IGridTreeRow<IAttribute>) => row.data.code;

  private get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
      this.selectedAttribute$.map(attribute => attribute && !attribute.disabledValue)
    ]);
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

  private fetch(): void {
    this.attributeService.fetchAll(this.entityTypeId, this.entityId).subscribe(attributes => {
      this.rows = this.convertToGridTreeRow(attributes);
      this.cdRef.markForCheck();
    });
  }
}
