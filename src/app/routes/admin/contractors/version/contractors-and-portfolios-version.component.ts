import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-contractors-and-portfolios-version',
  templateUrl: './contractors-and-portfolios-version.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractorsAndPortfoliosVersionComponent implements OnInit, OnDestroy {
  static ENTITY_TYPE_CONTRACTOR = 13;
  static ENTITY_TYPE_PORTFOLIO = 15;

  attributeId: number;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) {}

  ngOnInit(): void {
    this.paramsSub = this.route.paramMap
      .subscribe((params: ParamMap) => {
        if (params) {
          this.attributeId = Number(params.get('attributeId'));
          if ((this.entityId = Number(params.get('portfolioId')))) {
            this.entityTypeId = ContractorsAndPortfoliosVersionComponent.ENTITY_TYPE_PORTFOLIO;
          } else {
            this.entityId = Number(params.get('contractorId'));
            this.entityTypeId = ContractorsAndPortfoliosVersionComponent.ENTITY_TYPE_CONTRACTOR;
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  onBack(): void {
    const url = this.entityTypeId === ContractorsAndPortfoliosVersionComponent.ENTITY_TYPE_PORTFOLIO
      ? [
        '/admin',
        'contractors',
        this.route.snapshot.paramMap.get('contractorId'),
        'portfolios',
        this.route.snapshot.paramMap.get('portfolioId'),
        'attributes'
      ]
      : [
        '/admin',
        'contractors',
        this.route.snapshot.paramMap.get('contractorId'),
        'attributes'
      ];
    this.routingService.navigate(url);
  }
}
