import { ActivatedRoute } from '@angular/router';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { RoutingService } from '@app/core/routing/routing.service';

interface IEmploymentCardRouteParams {
  employmentId: number;
  contactId: number;
  contactPersonId: number;
}

@Component({
  selector: 'app-debtor-employment',
  templateUrl: './employment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorEmploymentComponent {
  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
    private routingService: RoutingService,
  ) {}

  get employmentId$(): Observable<number> {
    return this.routeParams$.map(params => params.employmentId);
  }

  /**
   * Depending on the route, this can be either a personId or a contactId
   */
  get personId$(): Observable<number> {
    return combineLatest(this.debtorCardService.personId$, this.routeParams$)
      .map(([ personId, params ]) => params.contactPersonId || params.contactId || personId)
      .distinctUntilChanged();
      /**
       * This experiment shows that despite the `onPush` mode
       * the component keeps triggering the Observable stream
       * that relentlessly emits values
       */
  }

  get routeParams$(): Observable<IEmploymentCardRouteParams> {
    return <Observable<IEmploymentCardRouteParams>>this.route.params.distinctUntilChanged();
  }

  onClose(): void {
    const { paramMap } = this.route.snapshot;
    const contactId       = paramMap.get('contactId');
    const contactPersonId = paramMap.get('contactPersonId');
    const debtId          = paramMap.get('debtId');
    this.routingService.navigate([
      `/app/workplaces/debtor-card/${debtId}`,
      ...(contactId ? [ 'contact', contactId ] : []),
      ...(contactPersonId ? [ 'contact', 'create' ] : [])
    ]);
  }
}
