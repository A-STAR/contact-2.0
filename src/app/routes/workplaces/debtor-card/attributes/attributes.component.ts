import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { IActionType } from '@app/core/app-modules/debtor-card/debtor-card.interface';

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
    private debtorCardService: DebtorCardService,
  ) {}

  ngOnInit(): void {
    this.entityId$ = this.debtorCardService.selectedDebtId$;
    this.entityTypeId = DebtorAttributesComponent.ENTITY_TYPE_DEBT;
    this.paramsSub = this.debtorCardService.selectedDebtId$
      .subscribe(entityId =>
        this.debtorCardService.dispatchAction(IActionType.SELECT_ENTITY,
          {
            entityId,
            entityTypeId: DebtorAttributesComponent.ENTITY_TYPE_DEBT
          })
      );
  }

  ngOnDestroy(): void {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }
}
