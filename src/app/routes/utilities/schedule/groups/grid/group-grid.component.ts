import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  OnInit, OnDestroy, Output, EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { IGroup } from '../groups.interface';

import { GroupsService } from '../groups.service';

import { DialogFunctions } from '@app/core/dialog';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { GridService } from '@app/shared/components/grid/grid.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-group-grid',
  templateUrl: './group-grid.component.html',
})
export class GroupGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedGroup$ = new BehaviorSubject<IGroup>(null);

  private forCurrentUser = false;

  @Output() select = new EventEmitter<number>();

  columns: Array<IGridColumn> = [
    { prop: 'id', width: 70 },
    { prop: 'entityTypeCode', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE, width: 90 },
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
      action: () => this.onEdit(this.selectedGroup$.value),
      enabled: this.selectedGroup$.flatMap(
        selectedGroup => selectedGroup
          ? this.groupService.canEdit$(selectedGroup).map(canEdit => !!canEdit && !!selectedGroup)
          : of(false)
      ),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeGroup'),
      enabled: this.selectedGroup$.flatMap(
        selectedGroup => selectedGroup
          ? this.groupService.canDelete$(selectedGroup).map(canDelete => !!canDelete && !!selectedGroup)
          : of(false)
      ),
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
  groups: IGroup[] = [];

  private actionSubscription: Subscription;
  private groupSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupsService,
    private gridService: GridService,
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

    this.fetch();

    this.actionSubscription = this.groupService
      .getAction(GroupsService.MESSAGE_GROUP_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedGroup$.next(this.selectedGroup);
      });

    this.groupSubscription = this.selectedGroup$
      .filter(Boolean)
      .subscribe(group => this.select.emit(group.id));
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
    this.actionSubscription.unsubscribe();
  }

  get selectedGroup(): IGroup {
    return (this.groups || [])
      .find(group => this.selectedGroup$.value && group.id === this.selectedGroup$.value.id);
  }

  get selection(): Array<IGroup> {
    const selectedGroup = this.selectedGroup;
    return selectedGroup ? [ selectedGroup ] : [];
  }

  toggleForCurrentUser(): void {
    this.forCurrentUser = !this.forCurrentUser;
    this.fetch();
  }

  onSelect(group: IGroup): void {
    this.selectedGroup$.next(group);
  }

  onEdit(group: IGroup): void {
    this.router.navigate([ `${this.router.url}/${group.id}` ]);
  }

  onRemove(): void {
    const { id: groupId } = this.selectedGroup;
    this.groupService.delete(groupId)
      .subscribe(() => {
        this.setDialog();
        this.selectedGroup$.next(null);
        this.fetch();
      });
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/create` ]);
  }

  private fetch(): void {
    this.groupService.fetchAll(this.forCurrentUser).subscribe(groups => {
      this.groups = groups;
      this.cdRef.markForCheck();
    });
  }
}
