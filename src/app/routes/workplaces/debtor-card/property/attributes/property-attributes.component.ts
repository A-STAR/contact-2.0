import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IActionType } from '../../../../../core/app-modules/debtor-card/debtor-card.interface';
import { IProperty } from '../property.interface';

import { DebtorCardService } from '../../../../../core/app-modules/debtor-card/debtor-card.service';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-debtor-property-attributes',
  templateUrl: './property-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorPropertyAttributesComponent implements OnInit {
  static ENTITY_TYPE_PROPERTY = 33;

  entityId$: Observable<number>;
  entityTypeId: number;

  tabs = [
    { title: 'debtor.propertyTab.attributes.title', isInitialised: true },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertyService: PropertyService,
    private debtorCardService: DebtorCardService) {}

  ngOnInit(): void {
    this.entityTypeId = DebtorPropertyAttributesComponent.ENTITY_TYPE_PROPERTY;
    this.entityId$ = this.propertyService
      .getPayload<IProperty>(PropertyService.MESSAGE_PROPERTY_SELECTED)
      .map(property => property ? property.id : null)
      .do(entityId => {
        this.debtorCardService.dispatchAction(IActionType.SELECT_ENTITY,
          {
            entityId,
            entityTypeId: DebtorPropertyAttributesComponent.ENTITY_TYPE_PROPERTY
          }
        );
        this.cdRef.markForCheck();
      });
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
    this.cdRef.markForCheck();
  }
}
