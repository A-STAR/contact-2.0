import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-debtor-attributes-versions',
  templateUrl: './debtor-attributes-versions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
})
export class DebtorAttributesVersionsComponent implements OnInit, OnDestroy {
  attributeId: number;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) { }

  ngOnInit(): void {

    this.paramsSub = combineLatest(
      this.route.paramMap,
      this.debtorCardService.entityId$,
      this.debtorCardService.entityTypeId$
    )
      .subscribe(([params, entityId, entityTypeId]: [ParamMap, number, number]) => {
        if (params) {
          this.attributeId = Number(params.get('attributeId'));
        }
        if (entityId) {
          this.entityId = entityId;
        }
        if (entityTypeId) {
          this.entityTypeId = entityTypeId;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  onBack(): void {
    this.routingService.navigate([
      '/workplaces',
      'debtor-card',
      this.route.snapshot.paramMap.get('debtId')
    ]);
  }
}




