import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';
import { IPledgeContract } from '../../../../../shared/gui-objects/widgets/pledge/pledge.interface';

import { MessageBusService } from '../../../../../core/message-bus/message-bus.service';
import { PledgeService } from '../../../../../shared/gui-objects/widgets/pledge/pledge.service';

import { AttributeGridComponent } from '../../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-debtor-pledge-attributes',
  templateUrl: './pledge-attributes.component.html'
})
export class DebtorPledgeAttributesComponent {
  static COMPONENT_NAME = 'DebtorPledgeAttributesComponent';
  static ENTITY_TYPE_PROPERY = 33;

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: AttributeGridComponent,
        title: 'debtor.propertyTab.attributes.title',
        inject: {
          entityTypeId$: Observable.of(DebtorPledgeAttributesComponent.ENTITY_TYPE_PROPERY),
          entityId$: this.messageBusService
            .select(PledgeService.MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED)
            .map((pledge: IPledgeContract) => pledge ? pledge.propertyId : null)
        }
      }
    ]
  };

  constructor(private messageBusService: MessageBusService) {}
}
