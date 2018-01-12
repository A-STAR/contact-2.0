import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IObject } from './objects.interface';
import { IOption } from '../../../../core/converter/value-converter.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ObjectsService } from './objects.service';
import { PermissionsService } from '../../../../routes/admin/roles/permissions.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-object-grid',
  templateUrl: './objects.component.html',
})
export class ObjectsComponent extends DialogFunctions implements OnInit, OnDestroy {
  private _dictionarySubscription: Subscription;
  private _masterRoleSubscription: Subscription;

  selectedObject$ = new BehaviorSubject<IObject>(null);
  masterRoleId$ = new BehaviorSubject<number>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.masterRoleId$.pipe(map(Boolean)),
      action: () => this.setDialog('add'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: this.selectedObject$.pipe(map(Boolean)),
      action: () => this.setDialog('delete'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.selectedObject$.pipe(map(Boolean)),
      action: () => this.fetch(),
    },
  ];

  columns: IGridColumn[] = [
    { prop: 'id' },
    { prop: 'name' },
  ];

  rows: IObject[] = [];

  dialog: 'add' | 'delete';

  typeCodeOptions = [];
  selectedTypeCode = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private objectsService: ObjectsService,
    private permissionsService: PermissionsService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this._masterRoleSubscription = this.permissionsService.permissions
      .pipe(distinctUntilKeyChanged('currentRole'))
      .subscribe(permissions => {
        const role = permissions.currentRole;
        this.masterRoleId$.next(role ? role.id : null);
        this.cdRef.markForCheck();
        this.fetch();
      });

    this._dictionarySubscription = this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ROLE_ENTITIES)
      .subscribe(options => {
        this.typeCodeOptions = options;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._dictionarySubscription.unsubscribe();
    this._masterRoleSubscription.unsubscribe();
  }

  onSelectType(options: IOption[]): void {
    this.selectedTypeCode = Number(options[0].value);
    this.fetch();
  }

  onSelect(object: IObject): void {
    this.selectedObject$.next(object);
  }

  onAddDialogSubmit(ids: number[]): void {
    this.objectsService
      .create(this.masterRoleId$.value, this.selectedTypeCode, ids)
      .subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.objectsService
      .delete(this.masterRoleId$.value, this.selectedTypeCode, [ this.selectedObject$.value.id ])
      .subscribe(() => this.onSuccess());
  }

  private fetch(): void {
    if (this.masterRoleId$.value) {
      this.objectsService.fetchAll(this.masterRoleId$.value, this.selectedTypeCode).subscribe(objects => this.setRows(objects));
    } else {
      this.setRows([]);
    }
    this.selectedObject$.next(null);
  }

  private setRows(rows: IObject[]): void {
    this.rows = rows;
    this.cdRef.markForCheck();
  }

  private onSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }
}