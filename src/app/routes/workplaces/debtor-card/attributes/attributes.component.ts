import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

@Component({
  selector: 'app-debtor-attributes',
  templateUrl: './attributes.component.html'
})
export class DebtorAttributesComponent implements OnInit, OnDestroy {
  static ENTITY_TYPE_DEBT = 19;

  entityTypeId: number;
  entityId$: Observable<number>;
  paramsSub: Subscription;

  constructor(
    private debtorService: DebtorService,
  ) {}

  ngOnInit(): void {
    this.entityId$ = this.debtorService.debtId$;
    this.entityTypeId = DebtorAttributesComponent.ENTITY_TYPE_DEBT;
    this.debtorService.entityTypeId$.next(this.entityTypeId);
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }
}
