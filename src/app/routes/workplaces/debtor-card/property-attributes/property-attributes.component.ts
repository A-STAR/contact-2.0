import { Component } from '@angular/core';
import { of } from 'rxjs/observable/of';

import { INode } from '../../../../shared/gui-objects/container/container.interface';
import { IProperty } from '../../../../shared/gui-objects/widgets/property/property.interface';

import { PropertyService } from '../../../../shared/gui-objects/widgets/property/property.service';

import { AttributeGridComponent } from '../../../../shared/gui-objects/widgets/entity-attribute/grid/attribute-grid.component';

@Component({
  selector: 'app-debtor-property-attributes',
  templateUrl: './property-attributes.component.html'
})
export class DebtorPropertyAttributesComponent {
  static COMPONENT_NAME = 'DebtorPropertyAttributesComponent';
  static ENTITY_TYPE_PROPERTY = 33;

  node: INode = {
    container: 'tabs',
    children: [
      {
        component: AttributeGridComponent,
        title: 'debtor.propertyTab.attributes.title',
        inject: {
          entityTypeId$: of(DebtorPropertyAttributesComponent.ENTITY_TYPE_PROPERTY),
          entityId$: this.propertyService
            .getPayload<IProperty>(PropertyService.MESSAGE_PROPERTY_SELECTED)
            .map(property => property ? property.id : null)
        }
      }
    ]
  };

  constructor(private propertyService: PropertyService) {}
}
