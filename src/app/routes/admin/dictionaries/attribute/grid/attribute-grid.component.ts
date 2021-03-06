import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map, first } from 'rxjs/operators';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IAttribute } from '../attribute.interface';
import { IAGridWrapperTreeColumn } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.interface';
import { IUserConstant } from '@app/core/user/constants/user-constants.interface';
import { IGridTreeRow } from './gridtree.interface';
import { IOption } from '@app/core/converter/value-converter.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { AttributeService } from '../attribute.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { makeKey } from '@app/core/utils';
import { combineLatestAnd } from '@app/core/utils';

import { TYPE_CODES } from '@app/core/utils';

const labelKey = makeKey('widgets.attribute.grid');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-attribute-grid',
  styleUrls: [ './attribute-grid.component.scss' ],
  templateUrl: './attribute-grid.component.html',
})
export class AttributeGridComponent extends DialogFunctions implements OnInit {
  treeType: number = null;
  treeTypeOptions = [];
  treeSubtype: number = null;
  treeSubtypeOptions = [];
  isTreeSubtypeDisabled = true;

  selectedAttribute$ = new BehaviorSubject<IAttribute>(null);

  readonly selectedAttributeId$: Observable<number> = this.selectedAttribute$.pipe(
    map(attribute => attribute.id)
  );
  readonly canAdd$: Observable<boolean> = this.userPermissionsService.has('ATTRIBUTE_TYPE_ADD');
  readonly canEdit$: Observable<boolean> = this.userPermissionsService.has('ATTRIBUTE_TYPE_EDIT');
  readonly canDelete$: Observable<boolean> = this.userPermissionsService.has('ATTRIBUTE_TYPE_DELETE');

  columns: Array<IAGridWrapperTreeColumn<IAttribute>> = [
    { dataType: TYPE_CODES.STRING, name: 'name', label: labelKey('names'), isDataPath: true },
    { dataType: TYPE_CODES.STRING, name: 'code', label: labelKey('code') },
    { dataType: TYPE_CODES.DICT, name: 'typeCode', label: labelKey('typeCode'),
      dictCode: UserDictionariesService.DICTIONARY_VARIABLE_TYPE, },
  ];

  attributes: IGridTreeRow<IAttribute>[] = [];

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        action: () => this.setDialog('add'),
        enabled: this.canAdd$,
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.setDialog('edit'),
        enabled: combineLatestAnd([ this.canEdit$, this.selectedAttribute$.map(Boolean) ]),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('delete'),
        enabled: combineLatestAnd([ this.canDelete$, this.selectedAttribute$.map(Boolean) ]),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
      },
    ]
  };

  dialog: 'add' | 'edit' | 'delete';

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
          UserDictionariesService.DICTIONARY_PROPERTY_TYPE,
          UserDictionariesService.DICTIONARY_ENTITY_TYPE,
        ]),
      this.userConstantsService.get('AttributeType.Entity.List'),
      this.userPermissionsService.has('ATTRIBUTE_TYPE_VIEW')
    )
    .pipe(first())
    .subscribe(([ dictionaries, constant, canView ]) => {
      this.initTreeTypeSelect(dictionaries, constant);
      this.initTreeSubtypeSelect(dictionaries);
      this.cdRef.markForCheck();
      if (canView) {
        this.fetch();
      } else {
        this.attributes = [];
        this.cdRef.markForCheck();
      }
    });
  }

  onTreeTypeChange(selection: number): void {
    this.treeType = selection;
    this.isTreeSubtypeDisabled = this.treeType !== 33;
    this.treeSubtype = this.initTreeSubtype();
    this.fetch();
  }

  onTreeSubtypeChange(selection: number): void {
    this.treeSubtype = selection;
    this.fetch();
  }

  onSelect(row: IGridTreeRow<IAttribute>): void {
    this.selectedAttribute$.next(row.data);
  }

  onEdit(row: IGridTreeRow<IAttribute>): void {
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

  onMove(row: IGridTreeRow<IAttribute>): void {
    const data = { parentId: row.parentId, sortOrder: row.sortOrder } as any;
    this.attributeService.update(this.treeType, this.treeSubtype, row.data.id, data)
      .subscribe(() => this.onSuccess());
  }

  onAddDialogSubmit(attribute: IAttribute): void {
    const parentId = this.selectedAttribute$.value ? this.selectedAttribute$.value.id : null;
    this.attributeService.create(this.treeType, this.treeSubtype, { ...attribute, parentId })
      .subscribe(() => this.onSuccess());
  }

  onEditDialogSubmit(attribute: IAttribute): void {
    this.attributeService.update(this.treeType, this.treeSubtype, this.selectedAttribute$.value.id, attribute)
      .subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.attributeService.delete(this.treeType, this.treeSubtype, this.selectedAttribute$.value.id)
      .subscribe(() => this.onSuccess());
  }

  private initTreeTypeSelect(dictionaries: { [key: number]: IOption[] }, constant: IUserConstant): void {
    const values = constant.valueS.split(/,\s*/).map(Number);
    this.treeTypeOptions = dictionaries[UserDictionariesService.DICTIONARY_ENTITY_TYPE]
      .filter(o => values.includes(Number(o.value)));
    this.treeType = this.treeTypeOptions ? this.treeTypeOptions[0].value : null;
  }

  private initTreeSubtypeSelect(dictionaries: { [key: number]: IOption[] }): void {
    this.treeSubtypeOptions = dictionaries[UserDictionariesService.DICTIONARY_PROPERTY_TYPE];
    this.treeSubtype = this.initTreeSubtype();
  }

  private initTreeSubtype(): number {
    return this.treeSubtypeOptions && this.treeType === 33 ? this.treeSubtypeOptions[0].value : null;
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
    this.attributeService.fetchAll(this.treeType, this.treeSubtype).subscribe(attributes => {
      this.attributes = this.convertToGridTreeRow(attributes);
      this.cdRef.markForCheck();
    });
  }

  private onSuccess(): void {
    this.setDialog(null);
    this.fetch();
  }
}
