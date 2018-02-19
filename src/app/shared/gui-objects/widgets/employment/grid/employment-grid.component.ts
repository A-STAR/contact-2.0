import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
  OnDestroy, Input, EventEmitter, Output
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { IEmployment } from '@app/shared/gui-objects/widgets/employment/employment.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { EmploymentService } from '../employment.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
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

  @Input()
  set personId(personId: number) {
    this._personId$.next(personId);
    this.cdRef.markForCheck();
  }

  @Output() add = new EventEmitter<void>();
  @Output() dblClick = new EventEmitter<IEmployment>();
  @Output() edit = new EventEmitter<IEmployment>();

  private _personId$ = new BehaviorSubject<number>(null);

  private selectedEmployment$ = new BehaviorSubject<IEmployment>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: combineLatestAnd([this.canAdd$, this._personId$.map(Boolean)]),
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedEmployment$.value),
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
      enabled: combineLatestAnd([this.canView$, this._personId$.map(Boolean)]),
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
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
        this.cdRef.markForCheck();
      });

    this.canViewSubscription = combineLatest(
      this.canView$,
      this._personId$.filter(Boolean)
    )
    .subscribe(([ hasPermission ]) => {
      if (hasPermission) {
        this.fetch();
      } else {
          this.notificationsService.permissionError().entity('entities.employment.gen.plural').dispatch();
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
    this.dblClick.emit(employment);
  }

  onSelect(employment: IEmployment): void {
    this.selectedEmployment$.next(employment);
  }

  onRemove(): void {
    const { id: employmentId } = this.selectedEmployment$.value;
    this.employmentService.delete(this._personId$.value, employmentId)
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
    this.add.emit();
  }

  private onEdit(employment: IEmployment): void {
    this.edit.emit(employment);
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
    this.employmentService.fetchAll(this._personId$.value)
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
