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
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';

import { IDebt } from '@app/routes/workplaces/shared/debt/debt.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { DebtService } from '@app/routes/workplaces/shared/debt/debt.service';
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

  readonly displayDebtData = this.debtorService.debtId$.pipe(map(Boolean));

  readonly canViewComponentLog$ = this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  readonly canViewPortfolioLog$ = this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');

  readonly debtorId = Number(this.route.snapshot.paramMap.get('debtorId'));
  readonly debtId   = Number(this.route.snapshot.paramMap.get('debtId'));

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtService: DebtService,
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    if (this.isEditMode) {
      this.debtService
        .fetch(null, this.debtId)
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
      this.debtService
        .update(this.debtorId, this.debtId, this.layout.getData())
        .subscribe(() => {
          // this.debtorService.refreshDebts();
          this.onBack();
        });
    } else {
      this.debtService
        .create(this.debtorId, this.layout.getData())
        .subscribe(() => {
          // this.debtorService.refreshDebts();
          this.onBack();
        });
    }
  }

  onBack(): void {
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }

  private get isEditMode(): boolean {
    return this.route.snapshot.url.join('/').indexOf('create') === -1;
  }
}
