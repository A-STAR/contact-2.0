import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IContactLog } from '@app/shared/gui-objects/widgets/contact-log-tab/contact-log.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContactLogService } from '@app/shared/gui-objects/widgets/contact-log-tab/contact-log.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contact-log-tab-grid',
  templateUrl: './contact-log-tab-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLogTabGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() debtId: number;
  @Input() hideToolbar = false;
  @Input() personId: number;

  selected: IContactLog[];
  selectedChanged$ = new BehaviorSubject<boolean>(false);

  columns: IGridColumn[] = [
    { prop: 'debtId', minWidth: 70, maxWidth: 100 },
    { prop: 'contactId', minWidth: 70, maxWidth: 100 },
    { prop: 'creditName', minWidth: 100, maxWidth: 150 },
    { prop: 'fullName', minWidth: 150, maxWidth: 200 },
    { prop: 'personRole', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'contactDateTime', minWidth: 150, maxWidth: 200, renderer: 'dateTimeRenderer' },
    { prop: 'contactType', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTACT_TYPE },
    { prop: 'userFullName', minWidth: 150, maxWidth: 200 },
    { prop: 'resultName', minWidth: 150, maxWidth: 200 },
    { prop: 'promiseDate', minWidth: 100 },
  ];

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selected[0]),
      enabled: combineLatest(
        this.canView$,
        this.selectedChanged$
      )
      .map(([canView, selected]) => canView && selected)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  private _contactLogList: IContactLog[] = [];

  private viewPermissionSubscription: Subscription;
  private viewCommentUpdate: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
    private gridService: GridService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.viewPermissionSubscription = this.canView$.subscribe(canView => {
      if (canView) {
        this.fetch();
      } else {
        this.clear();
        this.notificationsService.permissionError().entity('entities.contactLog.gen.plural').dispatch();
      }
    });

    this.viewCommentUpdate = this.contactLogService.getPayload(ContactLogService.COMMENT_CONTACT_LOG_SAVED)
      .flatMap(currentContactLogId => combineLatest(
          of(currentContactLogId),
          this.contactLogService.fetchAll(this.personId, this.callCenter)),
      )
      .subscribe(([currentContactLogId, contactLogList]) => {
        this.contactLogList = contactLogList;
        const currentContactLog = contactLogList
          ? contactLogList.find(row => row.contactId === Number(currentContactLogId)) : null;
        if (currentContactLog) {
          this.selected = [currentContactLog];
        }
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
    this.viewCommentUpdate.unsubscribe();
  }

  set contactLogList(val: IContactLog[]) {
    if (val) {
      this._contactLogList = [...val];
    }
    this.cdRef.markForCheck();
  }

  get contactLogList(): IContactLog[] {
    return this._contactLogList;
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_LOG_VIEW');
  }

  get hasSelection(): boolean {
    return !!this.selected && !!this.selected.length;
  }

  onSelect(contactLog: IContactLog): void {
    this.selected = [contactLog];
    this.selectedChanged$.next(true);
  }

  onEdit(contactLog: IContactLog): void {
    const { contactId, contactType } = contactLog;
    const url = this.callCenter
      ? `contactLog/${this.debtId}/${contactId}/contactLogType/${contactType}`
      : `contactLog/${contactId}/contactLogType/${contactType}`;

    this.routingService.navigate([ url ], this.route);
  }

  private fetch(): void {
    this.contactLogService.fetchAll(this.personId, this.callCenter)
      .subscribe(contactLogList => {
        this.contactLogList = contactLogList;
        this.selectedChanged$.next(this.hasSelection);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.contactLogList = [];
  }
}
