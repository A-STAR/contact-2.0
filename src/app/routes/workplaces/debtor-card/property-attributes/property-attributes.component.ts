import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IProperty } from '../../../../shared/gui-objects/widgets/property/property.interface';

import { PropertyService } from '../../../../shared/gui-objects/widgets/property/property.service';

@Component({
  selector: 'app-debtor-property-attributes',
  templateUrl: './property-attributes.component.html'
})
export class DebtorPropertyAttributesComponent implements OnInit {
  static COMPONENT_NAME = 'DebtorPropertyAttributesComponent';
  static ENTITY_TYPE_PROPERTY = 33;

  entityId$: Observable<number>;
  entityTypeId: number;

  tabs = [
    { title: 'debtor.propertyTab.attributes.title', isInitialised: true },
  ];

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.entityTypeId = DebtorPropertyAttributesComponent.ENTITY_TYPE_PROPERTY;
    this.entityId$ = this.propertyService
      .getPayload<IProperty>(PropertyService.MESSAGE_PROPERTY_SELECTED)
      .map(property => property ? property.id : null);
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
