import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IObject } from '../object.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ObjectService } from '../object.service';
import { NotificationsService } from 'app/core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-contractor-object-grid',
  templateUrl: './object-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  private dictionarySubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  @Input() contractorId: number;

  selectedObject$ = new BehaviorSubject<IObject>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.objectService.canAdd$,
      action: () => this.setDialog('add'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: this.objectService.canDelete$,
      action: () => this.setDialog('delete'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: this.objectService.canView$,
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
    private objectService: ObjectService,
    private notificationsService: NotificationsService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.viewPermissionSubscription = this.objectService.canView$
      .subscribe(hasViewPermission => {
        if (hasViewPermission) {
          this.fetch();
        } else {
          this.clear();
          this.notificationsService.permissionError().entity('entities.objects.gen.plural').dispatch();
        }
      });

    this.dictionarySubscription = this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ROLE_ENTITIES)
      .subscribe(options => {
        this.typeCodeOptions = options;
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.dictionarySubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  onSelectType(options: IOption[]): void {
    this.selectedTypeCode = Number(options[0].value);
    this.fetch();
  }

  onSelect(object: IObject): void {
    this.selectedObject$.next(object);
  }

  onAddDialogSubmit(ids: number[]): void {
    this.objectService
      .create(this.contractorId, this.selectedTypeCode, ids)
      .subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    this.objectService
      .delete(this.contractorId, this.selectedTypeCode, [ this.selectedObject$.value.id ])
      .subscribe(() => this.onSuccess());
  }

  private fetch(): void {
    this.objectService.fetchAll(this.contractorId, this.selectedTypeCode).subscribe(objects => {
      this.rows = objects;
      this.selectedObject$.next(null);
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this.rows = [];
    this.cdRef.markForCheck();
  }

  private onSuccess(): void {
    this.fetch();
    this.setDialog(null);
  }
}
