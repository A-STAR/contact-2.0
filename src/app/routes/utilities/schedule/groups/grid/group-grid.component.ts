import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { of } from 'rxjs/observable/of';

import { IGroup } from '../groups.interface';
import { IMetadataAction } from '@app/core/metadata/metadata.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { GroupsService } from '../groups.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { DialogFunctions } from '@app/core/dialog';

import { addGridLabel, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-group-grid',
  templateUrl: './group-grid.component.html',
})
export class GroupGridComponent extends DialogFunctions implements OnInit, OnDestroy {

  private selectedGroup$ = new BehaviorSubject<IGroup>(null);

  private forCurrentUser = false;

  @Output() onSelect = new EventEmitter<number>();

  columns: ISimpleGridColumn<IGroup>[] = [
    { prop: 'id', width: 70 },
    { prop: 'entityTypeCode', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE, width: 90 },
    { prop: 'name' },
    { prop: 'comment' },
    { prop: 'isManual', renderer: TickRendererComponent },
    { prop: 'isPreCleaned', renderer: TickRendererComponent },
    { prop: 'userFullName' },
    { prop: 'formDateTime' },
  ].map(addGridLabel('widgets.groups.grid'));

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

  actions: IMetadataAction[] = [
    {
      action: 'callList',
      enabled: () => this.selectedGroup$.value && this.selectedGroup$.value.entityTypeCode === 19,
      children: [
        {
          id: 19,
          action: 'callListCreate',
          asyncMode: false,
          params: [ 'id' ],
          addOptions: [
            {
              name: 'taskTypeCode',
              value: [ 1 ]
            }
          ],
          applyTo: {
            selected: true,
            all: true
          }
        },
        {
          id: 19,
          action: 'callListUpdate',
          asyncMode: false,
          params: [ 'id' ],
          addOptions: [
            {
              name: 'taskTypeCode',
              value: [ 2 ]
            }
          ],
          applyTo: {
            selected: true,
            all: true
          }
        }
      ]
    }
  ];

  dialog: string;
  groups: IGroup[] = [];

  private actionSubscription: Subscription;
  private groupSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupsService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();

    this.actionSubscription = this.groupService
      .getAction(GroupsService.MESSAGE_GROUP_SAVED)
      .subscribe(() => {
        this.fetch();
        this.selectedGroup$.next(this.selectedGroup);
      });

    this.groupSubscription = this.selectedGroup$
      .subscribe(group => this.onSelect.emit(group && group.id));
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

  onSelectRow(groups: IGroup[]): void {
    const group = isEmpty(groups)
      ? null
      : groups[0];
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
    this.selectedGroup$.next(null);
    this.groupService.fetchAll(this.forCurrentUser).subscribe(groups => {
      this.groups = groups;
      this.cdRef.markForCheck();
    });
  }
}
