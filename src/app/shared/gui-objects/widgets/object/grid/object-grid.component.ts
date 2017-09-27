import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IObject } from '../object.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ObjectService } from '../object.service';
import { PermissionsService } from '../../../../../routes/admin/roles/permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-object-grid',
  templateUrl: './object-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectGridComponent extends DialogFunctions implements OnInit {
  selectedObject$ = new BehaviorSubject<IObject>(null);

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.setDialog('add'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: this.canDelete$,
      action: () => this.setDialog('remove'),
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'name' },
  ];

  rows: Array<IObject> = [];

  dialog: 'add' | 'delete';

  constructor(
    private actions: Actions,
    private cdRef: ChangeDetectorRef,
    private objectService: ObjectService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.actions.ofType(PermissionsService.ROLE_SELECTED).subscribe(action => {
      this.fetch(action.payload.role.id);
    });
  }

  onSelect(object: IObject): void {
    this.selectedObject$.next(object);
  }

  onDoubleClick(object: IObject): void {
    this.selectedObject$.next(object);
    this.setDialog('edit');
  }

  private get canAdd$(): Observable<boolean> {
    return Observable.of(true);
  }

  private get canDelete$(): Observable<boolean> {
    return Observable.of(true);
  }

  private fetch(roleId: number): void {
    this.objectService.fetchAll(roleId, 1).subscribe(objects => {
      this.rows = objects;
      this.cdRef.markForCheck();
    });
  }
}
