import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAttribute } from '../attribute.interface';
import { IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IGridWrapperTreeColumn } from '../../../../components/gridtree-wrapper/gridtree-wrapper.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';

import { makeKey } from '../../../../../core/utils';
import { combineLatestAnd } from '../../../../../core/utils/helpers';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeGridComponent extends DialogFunctions implements OnInit {
  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  columns: Array<IGridWrapperTreeColumn<any>> = [
    {
      label: labelKey('name'),
      prop: 'name',
    },
    {
      label: labelKey('code'),
      prop: 'code',
    },
    {
      label: labelKey('typeCode'),
      prop: 'typeCode',
      // FIXME(d.maltsev): pass number instead of function
      dictCode: () => 1,
    },
  ];
  attributes: IGridTreeRow<IAttribute>[] = [];

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.setDialog('add'),
      enabled: this.canAdd$,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('edit'),
      enabled: combineLatestAnd([ this.canEdit$, this.selectedAttribute$.map(Boolean) ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: combineLatestAnd([ this.canDelete$, this.selectedAttribute$.map(Boolean) ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
    },
  ];

  dialog: 'add' | 'edit' | 'delete';

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userPermissionsService.has('ATTRIBUTE_TYPE_VIEW')
      .subscribe(canView => {
        if (canView) {
          this.fetch();
        } else {
          this.attributes = [];
          this.cdRef.markForCheck();
        }
      });
  }

  get selectedAttributeId$(): Observable<number> {
    return this.selectedAttribute$.map(attribute => attribute.id);
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('ATTRIBUTE_TYPE_ADD');
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('ATTRIBUTE_TYPE_EDIT');
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('ATTRIBUTE_TYPE_DELETE');
  }

  onSelect(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
  }

  onEdit(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
    this.canEdit$
      .take(1)
      .filter(Boolean)
      .subscribe(() => {
        this.setDialog('edit');
        this.cdRef.markForCheck();
      });
  }

  onMove(row: IGridTreeRow<IAttribute>): void {
    this.attributeService.update(row.data.id, { parentId: row.parentId, sortOrder: row.sortOrder } as any)
      .subscribe(() => this.onSuccess());
  }

  onAddDialogSubmit(attribute: IAttribute): void {
    const parentId = this.selectedAttribute$.value ? this.selectedAttribute$.value.id : null;
    this.attributeService.create({ ...attribute, parentId })
      .subscribe(() => this.onSuccess());
  }

  onEditDialogSubmit(attribute: IAttribute): void {
    this.attributeService.update(this.selectedAttribute$.value.id, attribute)
      .subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.attributeService.delete(this.selectedAttribute$.value.id)
      .subscribe(() => this.onSuccess());
  }

  private convertToGridTreeRow(attributes: IAttribute[], parentId: number = null): IGridTreeRow<IAttribute>[] {
    const sortByOrder = (a, b) => a.sortOrder - b.sortOrder;
    return attributes.map(attribute => {
      const { children, sortOrder, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      const node = { data: rest, sortOrder, parentId };
      return hasChildren
        ? { ...node, children: this.convertToGridTreeRow(children, rest.id).sort(sortByOrder), isExpanded: true }
        : node;
    });
  }

  private fetch(): void {
    this.attributeService.fetchAll().subscribe(attributes => {
      this.attributes = this.convertToGridTreeRow(attributes);
      this.cdRef.markForCheck();
    });
  }

  private onSuccess(): void {
    this.setDialog(null);
    this.fetch();
  }
}
