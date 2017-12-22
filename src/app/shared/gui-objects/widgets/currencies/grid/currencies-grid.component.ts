import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { ICurrencies } from '../currencies.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { CurrenciesService } from '../currencies.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  selector: 'app-currencies-grid',
  templateUrl: './currencies-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrenciesGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedCurrencies$ = new BehaviorSubject<ICurrencies>(null);

  private forCurrentUser = false;

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'entityTypeCode', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE },
    { prop: 'name' },
    { prop: 'comment' },
    { prop: 'isManual', renderer: 'checkboxRenderer' },
    { prop: 'isPreCleaned', renderer: 'checkboxRenderer' },
    { prop: 'userFullName' },
    { prop: 'formDateTime' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.groupService.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedCurrencies$.value),
      enabled: Observable.combineLatest(
        this.groupService.canEdit$,
        // this.selectedGroup$
      ).map(([canEdit, selectedGroup]) => !!canEdit && !!selectedGroup)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeGroup'),
      enabled: Observable.combineLatest(
        this.groupService.canDelete$,
        // this.selectedGroup$
      ).map(([canDelete, selectedGroup]) => !!canDelete && !!selectedGroup),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.groupService.canView$
    },
    {
      type: ToolbarItemTypeEnum.CHECKBOX,
      action: () => this.toggleForCurrentUser(),
      label: 'widgets.groups.toolbar.action.forCurrentUser',
      state: this.forCurrentUser
    }
  ];

  dialog: string;

  private _groups: Array<ICurrencies> = [];

  private viewPermissionSubscription: Subscription;
  private actionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: CurrenciesService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
    .pipe(first())
    .subscribe(columns => {
      this.columns = [...columns];
      this.cdRef.markForCheck();
    });

    this.viewPermissionSubscription = this.groupService.canView$
      .subscribe(hasViewPermission => {
        if (hasViewPermission) {
          this.fetch();
        } else {
          this.clear();
          this.notificationsService.error('errors.default.read.403').entity('entities.groups.gen.plural').dispatch();
        }
      });

    this.actionSubscription = this.groupService
      .getAction(CurrenciesService.MESSAGE_GROUP_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedCurrencies$.next(this.selectedGroup);
      });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get groups(): Array<ICurrencies> {
    return this._groups;
  }

  get selectedGroup(): ICurrencies {
    return (this._groups || [])
      .find(group => this.selectedCurrencies$.value && group.id === this.selectedCurrencies$.value.id);
  }

  get selection(): Array<ICurrencies> {
    const selectedGroup = this.selectedGroup;
    return selectedGroup ? [ selectedGroup ] : [];
  }

  toggleForCurrentUser(): void {
    this.forCurrentUser = !this.forCurrentUser;
    this.fetch();
  }

  onSelect(group: ICurrencies): void {
    this.selectedCurrencies$.next(group);
  }

  onEdit(group: ICurrencies): void {
    this.router.navigate([ `${this.router.url}/${group.id}` ]);
  }

  onRemove(): void {
    const { id: groupId } = this.selectedGroup;
    this.groupService.delete(groupId)
      .subscribe(() => {
        this.setDialog(null);
        // this.selectedGroup$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/create` ]);
  }

  private fetch(): void {
    this.groupService.fetchAll(this.forCurrentUser).subscribe(groups => {
      this._groups = groups;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._groups = [];
    this.cdRef.markForCheck();
  }
}
