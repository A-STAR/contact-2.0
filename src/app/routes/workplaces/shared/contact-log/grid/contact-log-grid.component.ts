import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { IContactLog } from '../contact-log.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { ContactLogService } from '../contact-log.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateRendererComponent, DateTimeRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-contact-log-grid',
  templateUrl: './contact-log-grid.component.html',
})
export class ContactLogGridComponent implements OnInit, OnDestroy {
  @Input() callCenter = false;
  @Input() debtId: number;
  @Input() hideToolbar = false;
  @Input() personId: number;

  selected: IContactLog[];
  selectedChanged$ = new BehaviorSubject<boolean>(false);

  columns: ISimpleGridColumn<IContactLog>[] = [
    { prop: 'debtId', minWidth: 70, maxWidth: 100 },
    { prop: 'contract', minWidth: 150, maxWidth: 200 },
    { prop: 'creditName', minWidth: 100, maxWidth: 150 },
    { prop: 'createDateTime', renderer: DateTimeRendererComponent, },
    { prop: 'fullName', minWidth: 150, maxWidth: 200 },
    { prop: 'personRole', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'contactDateTime', minWidth: 150, maxWidth: 200, renderer: DateTimeRendererComponent },
    { prop: 'contactType', minWidth: 100, maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTACT_TYPE },
    { prop: 'userFullName', minWidth: 150, maxWidth: 200 },
    { prop: 'resultName', minWidth: 150, maxWidth: 200 },
    {
      prop: 'msgStatusCode',
      dictCode: (item: IContactLog) => {
        switch (item.contactType) {
          case 4:
            return UserDictionariesService.DICTIONARY_SMS_STATUS;
          case 6:
            return UserDictionariesService.DICTIONARY_EMAIL_STATUS;
          default:
            return null;
        }
      }
    },
    { prop: 'contactData' },
    { prop: 'promiseDate', minWidth: 100, renderer: DateRendererComponent },
    { prop: 'comment' },
    { prop: 'messageTemplate' },
  ].map(addGridLabel('widgets.contactLog.grid'));

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
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
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

  onSelect(contactLogs: IContactLog[]): void {
    this.selected = contactLogs;
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
