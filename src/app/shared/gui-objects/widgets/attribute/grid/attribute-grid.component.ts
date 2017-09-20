import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAttribute, IAttributeResponse } from '../attribute.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions {
  private _columns: Array<IGridTreeColumn<IAttribute>> = [
    { label: 'Name', prop: 'name' },
    { label: 'Code', prop: 'code' },
    { label: 'TypeCode', prop: 'typeCode' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => console.log('add'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => console.log('edit'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => console.log('delete'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => console.log('fetch'),
    },
  ];

  dialog: 'add' | 'edit' | 'delete';

  rows: IGridTreeRow<Partial<IAttribute>>[] = [];

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
    this.fetch(1);
  }

  get options$(): Observable<IOption[]> {
    return this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ATTRIBUTE_TREE_TYPE)
      .distinctUntilChanged();
  }

  get columns(): Array<IGridTreeColumn<IAttribute>> {
    return this._columns;
  }

  onChange(event: Event): void {
    this.fetch(Number((event.target as HTMLSelectElement).value));
  }

  onRowDblClick(row: IAttribute): void {
    console.log('double click', row);
  }

  onRowSelect(row: IAttribute): void {
    console.log('select', row);
  }

  private convertToGridTreeRow(attributes: IAttributeResponse[]): IGridTreeRow<IAttribute>[] {
    return attributes.map(attribute => {
      const { children, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      return hasChildren
        ? { data: rest, children: this.convertToGridTreeRow(children), isExpanded: true }
        : { data: rest };
    });
  }

  private fetch(type: number): void {
    this.attributeService.fetchAll(type).subscribe(attributes => this.rows = this.convertToGridTreeRow(attributes));
    this.cdRef.markForCheck();
  }
}