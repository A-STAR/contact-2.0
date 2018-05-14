import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { RoutingService } from '@app/core/routing/routing.service';

@Component({
  selector: 'app-debtor-attributes-versions',
  templateUrl: './debtor-attributes-versions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
})
export class DebtorAttributesVersionsComponent implements OnInit, OnDestroy {
  attributeId: number;
  entityId: number;
  entityTypeId: number;

  private paramsSub: Subscription;

  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
    private routingService: RoutingService
  ) { }

  ngOnInit(): void {

    this.paramsSub = combineLatest(
      this.route.paramMap,
      this.debtorService.entityId$,
      this.debtorService.entityTypeId$
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
    const debtId = this.route.snapshot.paramMap.get('debtId');
    const debtorId = this.route.snapshot.paramMap.get('debtorId');
    if (debtId && debtorId) {
      this.routingService.navigate([ `/app/workplaces/debtor/${debtorId}/debt/${debtId}` ]);
    }
  }
}
