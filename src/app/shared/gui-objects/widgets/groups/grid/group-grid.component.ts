import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { IGroup } from '../group.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { GroupService } from '../group.service';
import { GridService } from '../../../../components/grid/grid.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-group-grid',
  templateUrl: './group-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupGridComponent implements OnInit, OnDestroy {

  columns: Array<IGridColumn> = [
    { prop: 'id' },
    { prop: 'entityTypeCode', dictCode: UserDictionariesService.DICTIONARY_ENTITY_TYPE },
    { prop: 'name' },
    { prop: 'comment' },
    { prop: 'isManual', renderer: 'checkboxRenderer' },
    { prop: 'isPreCleaned', renderer: 'checkboxRenderer' },
    { prop: 'userFullName' },
    { prop: 'formDateTime' }
  ];

  private _groups: Array<IGroup> = [];

  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private groupService: GroupService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) { }

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
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get groups(): Array<IGroup> {
    return this._groups;
  }

  private fetch(): void {
    this.groupService.fetchAll().subscribe(groups => {
      this._groups = groups;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._groups = [];
    this.cdRef.markForCheck();
  }
}
