import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  selector: 'app-contact-log-grid',
  templateUrl: './contact-log-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLogGridComponent implements OnInit, OnDestroy {

  private selectedProperty$ = new BehaviorSubject<IContactLog>(null);

  columns: Array<IGridColumn> = [
    { prop: 'debtId' },
    { prop: 'contactNumber' },
    { prop: 'creditName' },
    { prop: 'fullName'},
    { prop: 'personRole', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'contactDateTime' },
    { prop: 'contactType', dictCode: UserDictionariesService.DICTIONARY_CONTACT_LOG_TYPE },
    { prop: 'userFullName' },
    { prop: 'resultName' },
    { prop: 'promiseDate' },
  ];

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedProperty$.value),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.selectedProperty$
      ).map(([canEdit, selectedProperty]) => !!canEdit && !!selectedProperty)
    }
  ];

  private _contactLogList: Array<IContactLog> = [];

  private personId = (this.route.params as any).value.personId || null;

  private viewPermissionSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertyService: ContactLogService,
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

    this.viewPermissionSubscription = this.canEdit$.subscribe(hasViewPermission => {
      if (hasViewPermission) {
        this.fetch();
      } else {
        this.clear();
        this.notificationsService.error('errors.default.read.403').entity('entities.contactLog.gen.plural').dispatch();
      }
    });
  }

  ngOnDestroy(): void {
    this.viewPermissionSubscription.unsubscribe();
  }

  get contactLogList(): Array<IContactLog> {
    return this._contactLogList;
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('CONTACT_LOG_VIEW');
  }

  onSelect(property: IContactLog): void {
    this.selectedProperty$.next(property);
  }

  onEdit(contactLog: IContactLog): void {
    this.router.navigate([ `${this.router.url}/contactLog/${contactLog.id}/contactLogType/${contactLog.contactType}`]);
  }


  private fetch(): void {
    this.propertyService.fetchAll(this.personId).subscribe(contactLogList => {
      this._contactLogList = contactLogList;
      this.cdRef.markForCheck();
    });
  }

  private clear(): void {
    this._contactLogList = [];
  }
}
