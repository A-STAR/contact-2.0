import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IObject } from '../object.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ObjectService } from '../object.service';
import { NotificationsService } from 'app/core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { GridComponent } from 'app/shared/components/grid/grid.component';

import { DialogFunctions } from '../../../../../core/dialog';
import { combineLatestAnd } from '../../../../../core/utils/helpers';

@Component({
  selector: 'app-contractor-object-grid',
  templateUrl: './object-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  private dictionarySubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  @Input() contractorId: number;

  @ViewChild(GridComponent) grid: GridComponent;

  selectedObjects$ = new BehaviorSubject<IObject[]>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.objectService.canAdd$,
      action: () => this.setDialog('add'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: combineLatestAnd([
        this.objectService.canDelete$,
        this.selectedObjects$.map(objects => objects && !!objects.length)
      ]),
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
          this.notificationsService.permissionError().entity('entities.object.gen.plural').dispatch();
        }
      });

    this.dictionarySubscription = this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ROLE_ENTITIES)
      .subscribe(([ firstOpt, secondOpt ]) => {
        this.typeCodeOptions = [ firstOpt, secondOpt ];
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

  onSelect(objects: IObject[]): void {
    this.selectedObjects$.next(objects);
  }

  onAddDialogSubmit(ids: number[]): void {
    this.objectService
      .add(this.contractorId, this.selectedTypeCode, ids)
      .subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    const ids = this.grid.selected.map(item => item.id);
    this.objectService.delete(this.contractorId, this.selectedTypeCode, ids)
      .subscribe(() => this.onSuccess());
  }

  private fetch(): void {
    this.objectService.fetchAll(this.contractorId, this.selectedTypeCode).subscribe(objects => {
      this.rows = objects;
      this.selectedObjects$.next(null);
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
