import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { INode } from '../../../../shared/gui-objects/container/container.interface';
import { IProperty } from '../../../../shared/gui-objects/widgets/property/property.interface';

import { MessageBusService } from '../../../../core/message-bus/message-bus.service';
import { PropertyService } from '../../../../shared/gui-objects/widgets/property/property.service';

import { AttributeGridComponent } from '../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-debtor-property-attributes',
  templateUrl: './property-attributes.component.html'
})
export class DebtorPropertyAttributesComponent {
  static COMPONENT_NAME = 'DebtorPropertyAttributesComponent';
  static ENTITY_TYPE_PROPERY = 33;

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: AttributeGridComponent,
        title: 'debtor.propertyTab.attributes.title',
        inject: {
          entityTypeId$: Observable.of(DebtorPropertyAttributesComponent.ENTITY_TYPE_PROPERY),
          entityId$: this.messageBusService
            .select(PropertyService.MESSAGE_PROPERTY_SELECTED)
            .map((property: IProperty) => property ? property.id : null)
        }
      }
    ]
  };

  constructor(private messageBusService: MessageBusService) {}
}
