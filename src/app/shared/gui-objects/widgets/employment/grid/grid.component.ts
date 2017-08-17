import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
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
  private selectedDebtId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: this.canAdd$,
      action: () => this.onAdd()
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.combineLatest(this.canEdit$, this.selectedDebt$).map(([ canEdit, email ]) => canEdit && !!email),
      action: () => this.onEdit(this.selectedDebtId$.value)
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
        UserDictionariesService.DICTIONARY_PRODUCT_TYPE,
      ]),
      this.lookupService.currencyOptions,
    ).subscribe(([ dictionariesOptions, currencyOptions ]) => {
      this.renderers = {
        ...this.renderers,
        workTypeCode: [ ...dictionariesOptions[UserDictionariesService.DICTIONARY_PRODUCT_TYPE] ],
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

  }

  private onAdd(): void {
    this.router.navigate([ `${this.router.url}/employment/create` ]);
  }

  private onEdit(debtId: number): void {
    this.router.navigate([ `${this.router.url}/employment/${debtId}` ]);
  }

  get selectedDebt$(): Observable<IEmployment> {
    return this.selectedDebtId$.map(id => this.employments.find(employment => employment.id === id));
  }

  get canAdd$(): Observable<boolean> {
    return this.userPermissionsService
      .hasOne([
        'EMPLOYMENT_ADD',
      ])
      .distinctUntilChanged();
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService
      .hasOne([
        'DEBT_EDIT',
        'DEBT_PORTFOLIO_EDIT',
        'DEBT_COMPONENT_SUM_EDIT',
      ])
      .distinctUntilChanged();
  }

  private fetch(): Observable<IEmployment[]> {
    return this.employmentService.fetchAll(this.personId);
  }
}
