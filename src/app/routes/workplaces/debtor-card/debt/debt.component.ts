import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

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
export class DebtComponent implements AfterViewInit, OnInit {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;
  @ViewChild('debtComponents', { read: TemplateRef }) debtComponents: TemplateRef<any>;
  @ViewChild('portfolioLog', { read: TemplateRef }) portfolioLog: TemplateRef<any>;
  @ViewChild('componentLog', { read: TemplateRef }) componentLog: TemplateRef<any>;

  data = new BehaviorSubject<{ default?: Debt }>({});
  templates: Record<string, TemplateRef<any>>;

  isDisabled$ = of(true);

  readonly debtId$ = this.debtorService.debtId$;
  readonly displayDebtData = this.debtId$.pipe(map(Boolean));
  readonly canViewComponentLog$ = this.userPermissionsService.has('DEBT_COMPONENT_AMOUNT_LOG_VIEW');
  readonly canViewPortfolioLog$ = this.userPermissionsService.has('PORTFOLIO_LOG_VIEW');


  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {

    if (this.isEditMode) {
      this.debtorService.debt$
      .pipe(first())
      .subscribe(debt => this.data.next({ default: debt }));
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

  private get isEditMode(): boolean {
    return this.route.snapshot.url.join('/').indexOf('create') === -1;
  }
}
