import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IPledgeContract } from '../../../../shared/gui-objects/widgets/pledge/pledge.interface';

import { PledgeService } from '../../../../shared/gui-objects/widgets/pledge/pledge.service';

@Component({
  selector: 'app-debtor-pledge-attributes',
  templateUrl: './pledge-attributes.component.html'
})
export class DebtorPledgeAttributesComponent implements OnInit {
  static COMPONENT_NAME = 'DebtorPledgeAttributesComponent';
  static ENTITY_TYPE_PROPERTY = 33;

  entityId$: Observable<number>;
  entityTypeId: number;

  tabs = [
    { title: 'debtor.propertyTab.attributes.title', isInitialised: true },
  ];

  constructor(private pledgeService: PledgeService) {}

  ngOnInit(): void {
    this.entityTypeId = DebtorPledgeAttributesComponent.ENTITY_TYPE_PROPERTY;
    this.entityId$ = this.pledgeService
      .getPayload<IPledgeContract>(PledgeService.MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED)
      .map(pledge => pledge ? pledge.propertyId : null);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
