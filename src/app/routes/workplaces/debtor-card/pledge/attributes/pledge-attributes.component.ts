import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IActionType } from '../../../../../core/app-modules/debtor-card/debtor-card.interface';
import { IPledgeContract } from '@app/routes/workplaces/core/pledge/pledge.interface';

import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';
import { DebtorService } from '../../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-pledge-attributes',
  templateUrl: './pledge-attributes.component.html'
})
export class DebtorPledgeAttributesComponent implements OnInit {
  static ENTITY_TYPE_PROPERTY = 33;

  entityId$: Observable<number>;
  entityTypeId: number;

  tabs = [
    { title: 'debtor.propertyTab.attributes.title', isInitialised: true },
  ];

  constructor(
    private pledgeService: PledgeService,
    private debtorService: DebtorService
  ) {}

  ngOnInit(): void {
    this.entityTypeId = DebtorPledgeAttributesComponent.ENTITY_TYPE_PROPERTY;
    this.entityId$ = this.pledgeService
      .getPayload<IPledgeContract>(PledgeService.MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED)
      .map(pledge => pledge ? pledge.propertyId : null)
      .do(entityId => this.debtorService.dispatchAction(IActionType.SELECT_ENTITY,
          {
            entityId,
            entityTypeId: DebtorPledgeAttributesComponent.ENTITY_TYPE_PROPERTY
          }
        )
      );
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
