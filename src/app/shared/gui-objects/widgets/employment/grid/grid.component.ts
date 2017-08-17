import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
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
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-employment-grid',
  templateUrl: './grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentGridComponent {
  private selectedEmployment$ = new BehaviorSubject<IEmployment>(null);
  private selectedEmployment: IEmployment;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(this.selectedEmployment.id),
      enabled: Observable.combineLatest(
        this.canEdit$,
        this.selectedEmployment$
      ).map(([canEdit, selectedEmployment]) => !!canEdit && !!selectedEmployment)
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.onDelete(this.selectedEmployment.id),
      enabled: Observable.combineLatest(
        this.canDelete$,
        this.selectedEmployment$
      ).map(([canDelete, selectedEmployment]) => !!canDelete && !!selectedEmployment),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch()
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

  private personId = (this.route.params as any).value.id || null;

  private gridSubscription: Subscription;

  private renderers: IRenderer = {
    workTypeCode: [],
    currencyId: [],
    hireDate: 'dateTimeRenderer',
    dismissDate: 'dateTimeRenderer',
  };

  constructor(
    private cdRef: ChangeDetectorRef,
    private employmentService: EmploymentService,
    private gridService: GridService,
    private lookupService: LookupService,
    private route: ActivatedRoute,
    private router: Router,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.gridSubscription = Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_WORK_TYPE
      ]),
      this.lookupService.currencyOptions,
    ).subscribe(([ dictionariesOptions, currencyOptions ]) => {
      this.renderers = {
        ...this.renderers,
        workTypeCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_WORK_TYPE] ],
        currencyId: [ ...currencyOptions ],
      }
      this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      this.cdRef.markForCheck();
    });

    this.fetch().take(1).subscribe(employments => this.employments = employments);
  }

  onDoubleClick(employment: IEmployment): void {
    this.onEdit(employment.id);
  }

  onSelect(employment: IEmployment): void {
    this.selectedEmployment$.next(employment)
    this.selectedEmployment = employment;
  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/employment/create` ]);
  }

  private onEdit(employmentId: number): void {
    this.router.navigate([ `${this.router.url}/employment/${employmentId}` ]);
  }

  private onDelete(employmentId: number): Observable<void> {
    return this.employmentService.delete(this.personId, employmentId);
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

  private fetch(): Observable<IEmployment[]> {
    return this.employmentService.fetchAll(this.personId);
  }
}
