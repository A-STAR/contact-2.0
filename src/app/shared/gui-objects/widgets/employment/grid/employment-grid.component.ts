import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { IEmployment } from '@app/shared/gui-objects/widgets/employment/employment.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { EmploymentService } from '../employment.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';
import { combineLatestAnd } from 'app/core/utils/helpers';

@Component({
  selector: 'app-employment-grid',
  templateUrl: './employment-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentGridComponent implements OnInit, OnDestroy {
  // TODO(d.maltsev): always pass personId as input
  private routeParams = this.route.snapshot.paramMap;
  @Input() personId = +this.routeParams.get('contactId') || +this.routeParams.get('personId') || null;

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
      enabled: combineLatestAnd([
        this.canEdit$,
        this.selectedEmployment$.map(o => !!o)
      ])
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.setDialog('removeEmployment'),
      enabled: combineLatestAnd([
        this.canDelete$,
        this.selectedEmployment$.map(o => !!o)
      ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
      enabled: this.canView$
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'workTypeCode', dictCode: UserDictionariesService.DICTIONARY_WORK_TYPE },
    { prop: 'company' },
    { prop: 'position' },
    { prop: 'hireDate', maxWidth: 130, renderer: 'dateRenderer' },
    { prop: 'dismissDate', maxWidth: 130, renderer: 'dateRenderer' },
    { prop: 'income', maxWidth: 110, renderer: 'numberRenderer' },
    { prop: 'currencyId', maxWidth: 110, lookupKey: 'currencies' },
    { prop: 'comment' },
  ];

  employments: Array<IEmployment> = [];

  private dialog: string;

  private onSaveSubscription: Subscription;
  private canViewSubscription: Subscription;

  gridStyles = this.routeParams.get('contactId') ? { height: '230px' } : { height: '500px' };

  constructor(
    private cdRef: ChangeDetectorRef,
    private employmentService: EmploymentService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = this.canView$
      .subscribe(hasPermission => {
        if (hasPermission) {
          this.fetch();
        } else {
          this.notificationsService.error('errors.default.read.403').entity('entities.employment.gen.plural').dispatch();
          this.clear();
        }
      });

    this.onSaveSubscription = this.employmentService
      .getAction(EmploymentService.MESSAGE_EMPLOYMENT_SAVED)
      .subscribe(() => this.fetch());
  }

  ngOnDestroy(): void {
    this.selectedEmployment$.complete();
    this.onSaveSubscription.unsubscribe();
    this.canViewSubscription.unsubscribe();
  }

  onDoubleClick(employment: IEmployment): void {
    this.onEdit(employment.id);
  }

  onSelect(employment: IEmployment): void {
    this.selectedEmployment$.next(employment);
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
    this.routingService.navigate([ 'employment/create' ], this.route);
  }

  private onEdit(employmentId: number): void {
    this.routingService.navigate([ `employment/${employmentId}` ], this.route);
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
