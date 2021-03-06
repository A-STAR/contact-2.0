import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { Debt } from '@app/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-card',
  templateUrl: './debt.component.html',
})
export class DebtComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild('debtComponents', { read: TemplateRef }) debtComponents: TemplateRef<any>;
  @ViewChild('portfolioLog', { read: TemplateRef }) portfolioLog: TemplateRef<any>;
  @ViewChild('componentLog', { read: TemplateRef }) componentLog: TemplateRef<any>;

  data = new BehaviorSubject<{ default?: Debt }>({});
  templates: Record<string, TemplateRef<any>>;

  readonly isDisabled$ = new BehaviorSubject<boolean>(true);
  readonly isEditMode = !this.router.url.includes('edit/debt/create');

  readonly debtId$ = this.debtorService.debtId$;
  readonly displayDebtData = this.debtId$.pipe(map(Boolean));
  readonly canViewComponentLog$ = this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  readonly canViewPortfolioLog$ = this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');

  private debtSub: Subscription;
  private canSubmitSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private router: Router,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    if (this.isEditMode) {
      this.debtSub = this.debtorService.debt$.subscribe(debt => this.data.next({ default: debt }));
    } else {
      this.data.next({});
    }

    this.templates = {
      debtComponents: this.debtComponents,
      portfolioLog: this.portfolioLog,
      componentLog: this.componentLog,
    };
  }

  ngAfterViewInit(): void {
    this.canSubmitSub = this.layout.ready$
      .pipe(
        filter(Boolean),
        mergeMap(() => this.layout.canSubmit())
      )
      .subscribe(canSubmit => this.isDisabled$.next(!canSubmit));
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.debtorService
        .updateDebt(this.layout.getData())
        .subscribe(() => {
          this.debtorService.refreshDebts();
          this.onBack();
        });
    } else {
      this.debtorService
        .createDebt(this.layout.getData())
        .subscribe(() => {
          this.debtorService.refreshDebts();
          this.onBack();
        });
    }
  }

  onBack(): void {
    const debtId = this.debtorService.debtId$.value;
    const debtorId = this.debtorService.debtorId$.value;
    if (debtId && debtorId) {
      this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}/edit` ]);
    }
  }

  ngOnDestroy(): void {
    if (this.debtSub) {
      this.debtSub.unsubscribe();
    }
    if (this.canSubmitSub) {
      this.canSubmitSub.unsubscribe();
    }
  }

  readonly layoutConfig = this.isEditMode ? 'debt' : 'debt-create';

}
