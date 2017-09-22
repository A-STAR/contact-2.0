import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAttribute, IAttributeResponse } from '../attribute.interface';
import { IGridWrapperTreeColumn } from '../../../../components/gridtree-wrapper/gridtree-wrapper.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../attribute.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';

import { combineLatestAnd } from '../../../../../core/utils/helpers';
import { getRawValue, getDictCodeForValue } from '../../../../../core/utils/value';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent extends DialogFunctions implements OnInit {
  private _columns: Array<IGridWrapperTreeColumn<IAttribute>> = [
    { label: 'Code', prop: 'code' },
    { label: 'Name', prop: 'name' },
    { label: 'Value', valueGetter: (_, data) => getRawValue(data), dictCode: data => getDictCodeForValue(data) },
    { label: 'UserFullName', prop: 'userFullName' },
    { label: 'ChangeDateTime', prop: 'changeDateTime' },
    { label: 'Comment', prop: 'comment' },
  ];

  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('edit'),
      enabled: this.canEdit$,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
    },
  ];

  dialog: 'edit';

  rows: IGridTreeRow<Partial<IAttribute>>[] = [];

  private debtId = (<any>this.route.params).value.debtId;
  // TODO(d.maltsev): entityTypeId should be configurable
  private entityTypeId = 19;

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
  }

  get columns(): Array<IGridTreeColumn<IAttribute>> {
    return this._columns;
  }

  onRowDblClick(attribute: IAttribute): void {
    this.selectedAttribute$.next(attribute);
    this.canEdit$
      .take(1)
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

  }

  idGetter = (row: IGridTreeRow<IAttribute>) => row.data.code;

  private get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
      this.selectedAttribute$.map(attribute => attribute && !attribute.disabledValue)
    ]);
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

  private fetch(): void {
    this.attributeService.fetchAll(this.entityTypeId, this.debtId).subscribe(attributes => {
      this.rows = this.convertToGridTreeRow(attributes);
      this.cdRef.markForCheck();
    });
  }
}
