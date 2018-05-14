import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IActionType } from '@app/core/app-modules/debtor-card/debtor-card.interface';
import { IProperty } from '@app/routes/workplaces/core/property/property.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

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
    private debtorService: DebtorService) {}

  ngOnInit(): void {
    this.entityTypeId = DebtorPropertyAttributesComponent.ENTITY_TYPE_PROPERTY;
    this.entityId$ = this.propertyService
      .getPayload<IProperty>(PropertyService.MESSAGE_PROPERTY_SELECTED)
      .map(property => property ? property.id : null)
      .do(entityId => {
        this.debtorService.dispatchAction(IActionType.SELECT_ENTITY,
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
