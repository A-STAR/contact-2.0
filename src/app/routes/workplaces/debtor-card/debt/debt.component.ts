import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { first, flatMap, map } from 'rxjs/operators';

import { IDebt } from '@app/core/debt/debt.interface';

import { DebtService } from '@app/core/debt/debt.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { makeKey } from '@app/core/utils';
import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

const label = makeKey('widgets.debt');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-card',
  templateUrl: './debt.component.html',
})
export class DebtComponent implements OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild('foo', { read: TemplateRef }) foo: TemplateRef<any>;

  debt: IDebt;
  tabs = [
    { title: label('component.title'), isInitialised: true },
    { title: label('portfolioLog.title'), isInitialised: false },
    { title: label('componentLog.title'), isInitialised: false }
  ];
  templates: Record<string, TemplateRef<any>>;

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

    this.templates = {
      foo: this.foo,
    };
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
          ? this.debtService.update(personId, debtId, this.layout.data.default)
          : this.debtService.create(personId, this.layout.data.default);
      })
    )
    .subscribe(() => {
      this.debtorCardService.refreshDebts();
      this.onBack();
    });
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }

  get displayDebtData(): Observable<boolean> {
    return this.debtorCardService.selectedDebt$.pipe(map(Boolean));
  }

  get canSubmit(): boolean {
    return true;
    // return this.form && this.form.canSubmit;
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
