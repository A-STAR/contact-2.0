import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { RoutingService } from '@app/core/routing/routing.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { Debt } from '@app/entities';
import { invert } from '@app/core/utils';

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

  debt: Debt;
  templates: Record<string, TemplateRef<any>>;

  isDisabled$ = of(true);

  readonly displayDebtData = this.debtorService.debtId$.pipe(map(Boolean));

  readonly canViewComponentLog$ = this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  readonly canViewPortfolioLog$ = this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');

  private debtSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    if (this.isEditMode) {
      this.debtSub = this.debtorService.debt$
        .subscribe(debt => {
          this.debt = debt;
          this.cdRef.markForCheck();
        });
    }

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
      this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }

  ngOnDestroy(): void {
    if (this.debtSub) {
      this.debtSub.unsubscribe();
    }
  }

  private get isEditMode(): boolean {
    return this.route.snapshot.url.join('/').indexOf('create') === -1;
  }
}
