import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAttribute, IAttributeResponse } from '../attribute.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions implements OnInit {
  private _columns: Array<IGridTreeColumn<IAttribute>> = [
    { label: 'Code', prop: 'code' },
    { label: 'Name', prop: 'name' },
    { label: 'Value', valueFormatter: data => this.getValueByTypeCode(data) },
    { label: 'UserFullName', prop: 'userFullName' },
    { label: 'ChangeDateTime', prop: 'changeDateTime' },
    { label: 'Comment', prop: 'comment' },
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

  private debtId = (<any>this.route.params).value.debtId;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
  }

  get columns(): Array<IGridTreeColumn<IAttribute>> {
    return this._columns;
  }

  onRowDblClick(row: IAttribute): void {
    console.log('double click', row);
  }

  onRowSelect(row: IAttribute): void {
    console.log('select', row);
  }

  idGetter = (row: IGridTreeRow<IAttribute>) => row.data.code;

  private convertToGridTreeRow(attributes: IAttributeResponse[]): IGridTreeRow<IAttribute>[] {
    return attributes.map(attribute => {
      const { children, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      return hasChildren
        ? { data: rest, children: this.convertToGridTreeRow(children), isExpanded: true }
        : { data: rest };
    });
  }

  private fetch(): void {
    this.attributeService.fetchAll(19, this.debtId).subscribe(attributes => {
      this.rows = this.convertToGridTreeRow(attributes);
      this.cdRef.markForCheck();
    });
  }

  private getValueByTypeCode(data: IAttribute): string {
    switch (data.typeCode) {
      case 1:
      case 5:
        return String(data.valueN);
      case 2:
      case 7:
        return String(data.valueD);
      case 3:
        return data.valueS;
      case 4:
        return String(data.valueB);
      case 6:
        return `DICT_${data.dictNameCode}[${data.valueN}]`;
    }
  }
}
