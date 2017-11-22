import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IContactLog } from '../contact-log.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContactLogService } from '../contact-log.service';
import { GridService } from '../../../../components/grid/grid.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-contact-log-tab-grid',
  templateUrl: './contact-log-tab-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLogTabGridComponent implements OnInit, OnDestroy {

  selected: IContactLog[];
  selectedChanged$ = new BehaviorSubject<boolean>(false);

  columns: Array<IGridColumn> = [
    { prop: 'debtId', width: 50 },
    { prop: 'contactId', width: 70 },
    { prop: 'creditName', width: 80 },
    { prop: 'fullName', maxWidth: 200},
    { prop: 'personRole', width: 90, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'contactDateTime', maxWidth: 150, renderer: 'dateRenderer' },
    { prop: 'contactType', maxWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTACT_TYPE },
    { prop: 'userFullName', maxWidth: 200 },
    { prop: 'resultName', maxWidth: 200},
    { prop: 'promiseDate', width: 70 },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selected[0]),
      enabled: Observable.combineLatest(
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

  private _contactLogList: Array<IContactLog> = [];

  personId = (<any>this.route.params).value.personId || null;

  private viewPermissionSubscription: Subscription;
  private viewCommentUpdate: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
    private gridService: GridService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.viewPermissionSubscription = this.canView$.subscribe(hasViewPermission => {
      if (hasViewPermission) {
        this.fetch();
      } else {
        this.clear();
        this.notificationsService.error('errors.default.read.403').entity('entities.contactLog.gen.plural').dispatch();
      }
    });

    this.viewCommentUpdate = this.messageBusService.select(ContactLogService.COMMENT_CONTACT_LOG_SAVED)
      .flatMap(currentContactLogId => Observable.combineLatest(
          Observable.of(currentContactLogId),
          this.contactLogService.fetchAll(this.personId))
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

  get contactLogList(): Array<IContactLog> {
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
    console.log(contactLog);
    const { contactId, contactType } = contactLog;
    this.router.navigate([ `${this.router.url}/contactLog/${contactId}/contactLogType/${contactType}`]);
  }


  private fetch(): void {
    this.contactLogService.fetchAll(this.personId)
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
