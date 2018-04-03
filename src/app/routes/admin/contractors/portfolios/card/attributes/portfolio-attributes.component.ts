import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { RoutingService } from '@app/core/routing/routing.service';
@Component({
  selector: 'app-portfolio-attributes',
  templateUrl: './portfolio-attributes.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioAttributesComponent implements OnInit {
  static ENTITY_TYPE_PORTFOLIO = 15;

  entityTypeId: number;
  entityId$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService) { }

  ngOnInit(): void {
    this.entityTypeId = PortfolioAttributesComponent.ENTITY_TYPE_PORTFOLIO;
    this.entityId$ = this.route.paramMap.pipe(map(params => Number(params.get('portfolioId'))));
  }

  onBack(): void {
    const { paramMap } = this.route.snapshot;
    const contractorId = paramMap.get('contractorId');
    const portfolioId = paramMap.get('portfolioId');
    this.routingService.navigate([ `/app/admin/contractors/${contractorId}/portfolios/${portfolioId}` ]);
  }
}
