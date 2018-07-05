import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { EntityType } from '@app/core/entity/entity.interface';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-portfolio-documents',
  templateUrl: 'documents.component.html'
})
export class PortfolioDocumentsComponent {

  readonly portfolioId$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('portfolioId')),
  );

  readonly entityType = EntityType.PORTFOLIO;

  constructor(
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {}

  onBack(): void {
    this.routingService.navigateToUrl('/app/admin/contractors/{contractorId}/portfolios/{portfolioId}');
  }
}
