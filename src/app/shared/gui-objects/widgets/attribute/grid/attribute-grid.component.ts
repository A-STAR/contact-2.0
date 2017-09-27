import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAttribute, IAttributeResponse } from '../attribute.interface';
import { IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IGridWrapperTreeColumn } from '../../../../components/gridtree-wrapper/gridtree-wrapper.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';

import { DialogFunctions } from '../../../../../core/dialog';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html'
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
      enabled: this.canEdit$,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('delete'),
      enabled: this.canDelete$,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
    },
  ];

  dialog: 'add' | 'edit' | 'delete';

  constructor(private attributeService: AttributeService) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
  }

  get selectedAttributeId$(): Observable<number> {
    return this.selectedAttribute$.map(attribute => attribute.id);
  }

  onSelect(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
  }

  onEdit(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
    this.setDialog('edit');
  }

  onMove(rows: Array<IGridTreeRow<IAttribute>>): void {
    this.updatePosition(rows);
  }

  onAddDialogSubmit(attribute: IAttribute): void {
    this.attributeService.create(attribute).subscribe(() => this.onSuccess());
  }

  onEditDialogSubmit(attribute: IAttribute): void {
    this.attributeService.update(this.selectedAttribute$.value.id, attribute).subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.attributeService.delete(this.selectedAttribute$.value.id).subscribe(() => this.onSuccess());
  }

  private updatePosition(rows: Array<IGridTreeRow<IAttribute>>): void {
    rows.forEach(row => {
      this.attributeService.update(row.data.id, { sortOrder: row.sortOrder } as any).subscribe();
      if (row.children && row.children.length > 0) {
        this.updatePosition(row.children);
      }
    });
  }

  private convertToGridTreeRow(attributes: IAttributeResponse[]): IGridTreeRow<IAttribute>[] {
    const sortByOrder = (a, b) => a.sortOrder - b.sortOrder;
    return attributes.map(attribute => {
      const { children, sortOrder, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      return hasChildren
        ? { data: rest, children: this.convertToGridTreeRow(children).sort(sortByOrder), isExpanded: true, sortOrder }
        : { data: rest, sortOrder };
    });
  }

  private fetch(): void {
    this.attributeService.fetchAll().subscribe(attributes => {
      this.attributes = this.convertToGridTreeRow(attributes);
    });
  }

  private onSuccess(): void {
    this.setDialog(null);
    this.fetch();
 }

  private get canAdd$(): Observable<boolean> {
    return Observable.of(true);
  }

  private get canEdit$(): Observable<boolean> {
    return Observable.of(true);
  }

  private get canDelete$(): Observable<boolean> {
    return Observable.of(true);
  }
}
