import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { invert } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-card',
  templateUrl: './debt.component.html',
})
export class DebtComponent implements AfterViewInit, OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild('debtComponents', { read: TemplateRef }) debtComponents: TemplateRef<any>;
  @ViewChild('portfolioLog', { read: TemplateRef }) portfolioLog: TemplateRef<any>;
  @ViewChild('componentLog', { read: TemplateRef }) componentLog: TemplateRef<any>;

  debt: IDebt;
  templates: Record<string, TemplateRef<any>>;

  isDisabled$ = of(true);

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
      debtComponents: this.debtComponents,
      portfolioLog: this.portfolioLog,
      componentLog: this.componentLog,
    };
  }

  ngAfterViewInit(): void {
    this.isDisabled$ = this.layout.canSubmit().pipe(
      map(invert),
    );
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
        return debtId
          ? this.debtService.update(personId, debtId, this.layout.getData())
          : this.debtService.create(personId, this.layout.getData());
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

  get canViewComponentLog$(): Observable<boolean> {
    return this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  }

  get canViewPortfolioLog$(): Observable<boolean> {
    return this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');
  }

  private isRoute(segment: string): boolean {
    return this.route.snapshot.url.join('/').indexOf(segment) !== -1;
  }
}
