import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-versions',
  templateUrl: './versions.component.html',
})
export class VersionsComponent implements OnInit, OnDestroy {
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
            this.entityTypeId = VersionsComponent.ENTITY_TYPE_PORTFOLIO;
          } else {
            this.entityId = Number(params.get('contractorId'));
            this.entityTypeId = VersionsComponent.ENTITY_TYPE_CONTRACTOR;
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
    const { paramMap } = this.route.snapshot;
    const contractorId = paramMap.get('contractorId');
    const portfolioId = paramMap.get('portfolioId');
    const url = this.entityTypeId === VersionsComponent.ENTITY_TYPE_PORTFOLIO
      ? [ `/app/admin/contractors/${contractorId}/portfolios/${portfolioId}/attributes` ]
      : [ `/app/admin/contractors/${contractorId}/attributes` ];
    this.routingService.navigate(url);
  }
}
