import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IEmployment } from '../employment.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { EmploymentService } from '../employment.service';
import { GridService } from '../../../../components/grid/grid.service';
import { LookupService } from '../../../../../core/lookup/lookup.service';
import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { NotificationsService } from '../../../../../core/notifications/notifications.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-employment-grid',
  templateUrl: './employment-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentGridComponent implements OnInit, OnDestroy {

  private selectedEmployment$ = new BehaviorSubject<IEmployment>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedEmployment$.value.id),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.selectedEmployment$
      ).map(([canEdit, selectedEmployment]) => !!canEdit && !!selectedEmployment)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeEmployment'),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.selectedEmployment$
      ).map(([canDelete, selectedEmployment]) => !!canDelete && !!selectedEmployment),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'workTypeCode' },
    { prop: 'company' },
    { prop: 'position' },
    { prop: 'hireDate', maxWidth: 130 },
    { prop: 'dismissDate', maxWidth: 130 },
    { prop: 'income', maxWidth: 110 },
    { prop: 'currencyId', maxWidth: 110 },
    { prop: 'comment' },
  ];

  employments: Array<IEmployment> = [];

  private dialog: string;
  private routeParams = (<any>this.route.params).value;
  private personId = this.routeParams.contactId || this.routeParams.id || null;

  private busSubscription: Subscription;
  private canViewSubscription: Subscription;
  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    workTypeCode: [],
    currencyId: [],
    income: 'numberRenderer',
    hireDate: 'dateTimeRenderer',
    dismissDate: 'dateTimeRenderer',
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private employmentService: EmploymentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private messageBusService: MessageBusService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionaryAsOptions(
        UserDictionariesService.DICTIONARY_WORK_TYPE
      ),
      this.lookupService.currencyOptions,
    )
    .subscribe(([ dictOptions, currencyOptions ]) => {
      this.renderers = {
        ...this.renderers,
        workTypeCode: [ ...dictOptions ],
        currencyId: [ ...currencyOptions ],
      }
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.canViewSubscription = this.canView$
      .filter(canView => canView !== undefined)
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.identityDocs.gen.plural').dispatch();
          this.clear();
        }
      });

    this.busSubscription = this.messageBusService
      .select(EmploymentService.MESSAGE_EMPLOYMENT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedEmployment$.complete();
    this.busSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
    this.gridSubscription.unsubscribe();
  }

  onDoubleClick(employment: IEmployment): void {
    this.onEdit(employment.id);
  }

  onSelect(employment: IEmployment): void {
    this.selectedEmployment$.next(employment)
  }

  onRemove(): void {
    const { id: employmentId } = this.selectedEmployment$.value;
    this.employmentService.delete(this.personId, employmentId)
      .subscribe(() => {
        this.setDialog(null);
        this.fetch();
      });
  }

  isDialog(dialog: string): boolean {
    return this.dialog === dialog;
  }

  setDialog(dialog: string): void {
    this.dialog = dialog;
  }

  onCancel(): void {
    this.setDialog(null);
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/employment/create` ]);
  }

  private onEdit(employmentId: number): void {
    this.router.navigate([ `${this.router.url}/employment/${employmentId}` ]);
  }

  get canView$(): Observable<boolean> {
    return this.userPermissionsService.has('EMPLOYMENT_VIEW').distinctUntilChanged();
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService.has('EMPLOYMENT_ADD').distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('EMPLOYMENT_EDIT').distinctUntilChanged();
  }

  get canDelete$(): Observable<boolean> {
    return this.userPermissionsService.has('EMPLOYMENT_DELETE').distinctUntilChanged();
  }

  private fetch(): void {
    this.employmentService.fetchAll(this.personId)
      .subscribe(employments => {
        this.employments = [].concat(employments);
        this.selectedEmployment$.next(null);
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.employments = [];
    this.selectedEmployment$.next(null);
    this.cdRef.markForCheck();
  }

}
