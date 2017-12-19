import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IAttribute, IAttributeVersion } from '../../attribute.interface';
import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AttributeService } from '../../attribute.service';
import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { ContentTabService } from '../../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';
import { ValueConverterService } from './../../../../../../core/converter/value-converter.service';

import { GridComponent } from '../../../../../../shared/components/grid/grid.component';

import { DialogFunctions } from '../../../../../../core/dialog';
import { combineLatestAnd } from 'app/core/utils/helpers';

@Component({
  selector: 'app-attribute-version',
  templateUrl: './attribute-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeVersionComponent extends DialogFunctions implements OnInit, OnDestroy, OnChanges {

  @Input() selectedAttribute: IAttribute;
  @Input() entityId: number;
  @Input() entityTypeId: number;

  @ViewChild(GridComponent) grid: GridComponent;

  selectedVersion$ = new BehaviorSubject<IAttributeVersion>(null);
  attributeChanges$ =  new BehaviorSubject<IAttribute>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.setDialog('add'),
      enabled: combineLatestAnd([
        this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
        this.attributeChanges$.map(attr => attr && attr.disabledValue !== -1),
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.setDialog('edit'),
      enabled: combineLatestAnd([
        this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
        this.attributeChanges$.map(attr => attr && attr.disabledValue !== -1),
        this.selectedVersion$.map(version => !!version)
      ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.entityTypeId && this.entityId && this.selectedAttribute
        && this.fetch().subscribe(versions => this.onVersionsFetch(versions)),
    },
  ];


  dialog: string;

  rows: IAttributeVersion[] = [];
  private entitySubscription: Subscription;

  columns: Array<IGridColumn> = [
    { prop: 'code', minWidth: 150 },
    {
      prop: 'value', minWidth: 150,
      renderer: (version: any) => this.valueConverterService.deserialize({
        ...version,
        typeCode: this.selectedAttribute.typeCode
      })
    },
    { prop: 'typeCode', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_ATTRIBUTE_TREE_TYPE },
    { prop: 'fromDateTime', minWidth: 150, renderer: 'dateTimeRenderer' },
    { prop: 'toDateTime', minWidth: 150, renderer: 'dateTimeRenderer' },
    { prop: 'userFullName', minWidth: 100 },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contentTabService: ContentTabService,
    private gridService: GridService,
    private attributeService: AttributeService,
    private router: Router,
    private userPermissionsService: UserPermissionsService,
    private valueConverterService: ValueConverterService
  ) {
    super();
  }

  onRowSelect(version: IAttributeVersion): void {
    this.selectedVersion$.next(version);
  }

  ngOnInit(): void {

    if (!this.entityTypeId) {
      this.contentTabService.gotoParent(this.router, 1);
    }

    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.entitySubscription = this.userPermissionsService.contains('ATTRIBUTE_VERSION_VIEW_LIST', this.entityTypeId)
      .switchMap(canView => canView && this.entityTypeId
        && this.selectedAttribute && this.selectedAttribute.userId ? this.fetch() : Observable.of([]))
      .subscribe(versions => this.onVersionsFetch(versions));
  }

  ngOnDestroy(): void {
    this.grid.clearSelection();
    this.entitySubscription.unsubscribe();
  }

  onRowDblClick(version: IAttributeVersion): void {
    this.selectedVersion$.next(version);
    this.canEdit$
      .pipe(first())
      .filter(Boolean)
      .subscribe(() => {
        this.setDialog('edit');
        this.cdRef.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.selectedAttribute) {
      this.attributeChanges$.next(changes.selectedAttribute.currentValue);
    }
  }

  onEditDialogSubmit(version: IAttributeVersion): void {
    this.attributeService.update(this.entityTypeId, this.entityId, this.selectedAttribute.code, version)
      .switchMap(() => this.fetch())
      .subscribe(versions => this.onVersionsFetch(versions));
  }

  private fetch(): Observable<IAttributeVersion[]> {
    return this.attributeService.fetchAllVersions(this.entityTypeId, this.entityId, this.selectedAttribute.code);
  }

  private onVersionsFetch(versions: IAttributeVersion[]): void {
    this.rows = versions;
    this.grid.clearSelection();
    this.setDialog(null);
    this.cdRef.markForCheck();
  }

  private get canEdit$(): Observable<boolean> {
    return combineLatestAnd([
      this.userPermissionsService.contains('ATTRIBUTE_EDIT_LIST', this.entityTypeId),
      this.attributeChanges$.map(attr => attr && attr.disabledValue !== -1)
    ]);
  }

}
