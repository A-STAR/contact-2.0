import { Component } from '@angular/core';
import { of } from 'rxjs/observable/of';

import { INode } from '../../../../shared/gui-objects/container/container.interface';
import { IPledgeContract } from '../../../../shared/gui-objects/widgets/pledge/pledge.interface';

import { PledgeService } from '../../../../shared/gui-objects/widgets/pledge/pledge.service';

import { AttributeGridComponent } from '../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-debtor-pledge-attributes',
  templateUrl: './pledge-attributes.component.html'
})
export class DebtorPledgeAttributesComponent {
  static COMPONENT_NAME = 'DebtorPledgeAttributesComponent';
  static ENTITY_TYPE_PROPERTY = 33;

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: AttributeGridComponent,
        title: 'debtor.propertyTab.attributes.title',
        inject: {
          entityTypeId$: of(DebtorPledgeAttributesComponent.ENTITY_TYPE_PROPERTY),
          entityId$: this.pledgeService
            .getPayload<IPledgeContract>(PledgeService.MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED)
            .map(pledge => pledge ? pledge.propertyId : null)
        }
      }
    ]
  };

  constructor(private pledgeService: PledgeService) {}
}