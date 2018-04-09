import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first, flatMap, map } from 'rxjs/operators';

import { IDebt } from '@app/core/debt/debt.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { DebtService } from '@app/core/debt/debt.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { makeKey } from '@app/core/utils';
import { MetadataFormComponent } from '@app/shared/components/form/metadata-form/metadata-form.component';

const label = makeKey('widgets.debt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-card',
  templateUrl: './debt.component.html',
})
export class DebtComponent implements OnInit {
  @ViewChild(MetadataFormComponent) form: MetadataFormComponent<IDebt>;

  controls: Array<IDynamicFormItem> = null;
  debt: IDebt;
  tabs = [
    { title: label('component.title'), isInitialised: true },
    { title: label('portfolioLog.title'), isInitialised: false },
    { title: label('componentLog.title'), isInitialised: false }
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    this.debtId$.pipe(
      flatMap(debtId => debtId ? this.debtService.fetch(null, debtId) : of(null)),
      first(),
    )
    .subscribe(debt => {
      this.debt = debt;
      this.cdRef.markForCheck();
    });
  }

  get debtId$(): Observable<number> {
    return this.debtorCardService.selectedDebtId$.pipe(
      map(debtId => this.isRoute('create') ? null : debtId),
    );
  }

  onSubmit(): void {
    combineLatest(
      this.debtorCardService.personId$,
      this.debtId$,
    )
    .pipe(
      first(),
      flatMap(([personId, debtId]) => {
        // return debtId
        //   ? this.debtService.update(personId, debtId, this.form.serializedUpdates)
        //   : this.debtService.create(personId, this.form.serializedUpdates);
        return debtId
          ? this.debtService.update(personId, debtId, this.form.data)
          : this.debtService.create(personId, this.form.data);
      })
    )
    .subscribe(() => {
      this.debtorCardService.refreshDebts();
      this.onBack();
    });
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    this.routingService.navigate([ `/app/workplaces/debtor-card/${debtId}` ]);
  }

  get displayDebtData(): Observable<boolean> {
    return this.debtorCardService.selectedDebt$.pipe(map(Boolean));
  }

  get canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  get canViewComponentLog$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  }

  get canViewPortfolioLog$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
