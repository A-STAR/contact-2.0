import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit,
  OnDestroy, Input, EventEmitter, Output
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { IEmployment } from '@app/routes/workplaces/core/employment/employment.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { EmploymentService } from '@app/routes/workplaces/core/employment/employment.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { combineLatestAnd } from 'app/core/utils/helpers';
import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-employment-grid',
  templateUrl: './employment-grid.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentGridComponent implements OnInit, OnDestroy {

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

  toolbar: Toolbar = {
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.ADD,
        enabled: combineLatestAnd([this.canAdd$, this._personId$.map(Boolean)]),
        action: () => this.onAdd()
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.EDIT,
        action: () => this.onEdit(this.selectedEmployment$.value),
        enabled: combineLatestAnd([
          this.canEdit$,
          this.selectedEmployment$.map(o => !!o)
        ])
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DELETE,
        action: () => this.setDialog('removeEmployment'),
        enabled: combineLatestAnd([
          this.canDelete$,
          this.selectedEmployment$.map(o => !!o)
        ]),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REFRESH,
        action: () => this.fetch(),
        enabled: combineLatestAnd([this.canView$, this._personId$.map(Boolean)]),
      },
    ]
  };

  columns: Array<ISimpleGridColumn<IEmployment>> = [
    { prop: 'workTypeCode', dictCode: UserDictionariesService.DICTIONARY_WORK_TYPE },
    { prop: 'company' },
    { prop: 'position' },
    { prop: 'hireDate', maxWidth: 130, renderer: DateRendererComponent },
    { prop: 'dismissDate', maxWidth: 130, renderer: DateRendererComponent },
    { prop: 'income', maxWidth: 110, },
    // TODO(d.maltsev): not ready
    // renderer: NumberRendererComponent },
    { prop: 'currencyId', maxWidth: 110, lookupKey: 'currencies' },
    { prop: 'comment' },
  ].map(addGridLabel('widgets.employment.grid'));

  employments: Array<IEmployment> = [];

  private dialog: string;

  private onSaveSubscription: Subscription;
  private canViewSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private employmentService: EmploymentService,
    private notificationsService: NotificationsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {

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

  onSelect(employments: IEmployment[]): void {
    this.selectedEmployment$.next(Array.isArray(employments) ? employments[0] : null);
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
