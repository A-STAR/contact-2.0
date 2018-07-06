import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilKeyChanged, map } from 'rxjs/operators';

import { IObject } from './objects.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ObjectsService } from './objects.service';
import { PermissionsService } from '@app/routes/admin/roles/permissions.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd, addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-object-grid',
  templateUrl: './objects.component.html',
})
export class ObjectsComponent extends DialogFunctions implements OnInit, OnDestroy {
  private _dictionarySubscription: Subscription;
  private _masterRoleSubscription: Subscription;

  selectedObject$ = new BehaviorSubject<IObject>(null);
  masterRoleId$ = new BehaviorSubject<number>(null);

  readonly canEdit$: Observable<boolean> = this.userPermissionsService.has('OBJECT_ROLE_EDIT');

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      enabled: combineLatestAnd([ this.masterRoleId$.pipe(map(Boolean)), this.canEdit$ ]),
      action: () => this.setDialog('add'),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      enabled: combineLatestAnd([ this.selectedObject$.pipe(map(Boolean)), this.canEdit$ ]),
      action: () => this.setDialog('delete'),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      enabled: this.selectedObject$.pipe(map(Boolean)),
      action: () => this.fetch(),
    },
  ];

  columns: ISimpleGridColumn<IObject>[] = [
    { prop: 'id' },
    { prop: 'name' },
  ].map(addGridLabel('widgets.object.grid'));

  rows: IObject[] = [];

  dialog: 'add' | 'delete';

  typeCodeOptions = [];
  selectedTypeCode = 1;

  constructor(
    private cdRef: ChangeDetectorRef,
    private objectsService: ObjectsService,
    private permissionsService: PermissionsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
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

  onSelectType(typeCode: number): void {
    this.selectedTypeCode = Number(typeCode);
    this.fetch();
  }

  onSelect(objects: IObject[]): void {
    const object = isEmpty(objects)
      ? null
      : objects[0];
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
