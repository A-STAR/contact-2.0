import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IObject } from '../objects.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { ObjectsService } from '../objects.service';
import { NotificationsService } from 'app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addGridLabel } from '@app/core/utils';
import { DialogFunctions } from '@app/core/dialog';
import { combineLatestAnd } from '@app/core/utils';

@Component({
  selector: 'app-objects-grid',
  templateUrl: './objects-grid.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectsGridComponent extends DialogFunctions implements OnInit, OnDestroy {
  private dictionarySubscription: Subscription;
  private viewPermissionSubscription: Subscription;

  selectedObjects$ = new BehaviorSubject<IObject[]>(null);

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        enabled: this.objectsService.canAdd$,
        action: () => this.setDialog('add'),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        enabled: combineLatestAnd([
          this.objectsService.canDelete$,
          this.selectedObjects$.map(objects => objects && !!objects.length)
        ]),
        action: () => this.setDialog('delete'),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        enabled: this.objectsService.canView$,
        action: () => this.fetch(),
      },
    ]
  };

  columns: Array<ISimpleGridColumn<IObject>> = [
    { prop: 'id' },
    { prop: 'name' },
  ].map(addGridLabel('widgets.contractorObject.grid'));

  rows: IObject[] = [];

  dialog: 'add' | 'delete';

  typeCodeOptions = [];
  selectedTypeCode = 1;

  private selection: IObject[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private objectsService: ObjectsService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userDictionariesService: UserDictionariesService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.viewPermissionSubscription = this.objectsService.canView$
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
      .subscribe(([ firstOpt, secondOpt, _, fourOpt ]) => {
        this.typeCodeOptions = [ firstOpt, secondOpt, fourOpt ];
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.dictionarySubscription.unsubscribe();
    this.viewPermissionSubscription.unsubscribe();
  }

  onSelectType(typeCode: number): void {
    this.selectedTypeCode = typeCode;
    this.fetch();
  }

  onSelect(objects: IObject[]): void {
    this.selection = objects;
    this.selectedObjects$.next(objects);
  }

  onAddDialogSubmit(ids: number[]): void {
    this.objectsService
      .add(this.contractorId, this.selectedTypeCode, ids)
      .subscribe(() => this.onSuccess());
  }

  onRemoveDialogSubmit(): void {
    const ids = this.selection.map(item => item.id);
    this.objectsService.delete(this.contractorId, this.selectedTypeCode, ids)
      .subscribe(() => this.onSuccess());
  }

  get contractorId(): number {
    return Number(this.route.snapshot.paramMap.get('contractorId'));
  }

  onBack(): void {
    this.routingService.navigate([ `/app/admin/contractors/${String(this.contractorId)}` ]);
  }

  private fetch(): void {
    this.objectsService.fetchAll(this.contractorId, this.selectedTypeCode).subscribe(objects => {
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
