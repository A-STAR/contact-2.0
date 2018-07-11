import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EntityType } from '@app/core/entity/entity.interface';
import { IProperty } from '@app/routes/workplaces/core/property/property.interface';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';
import { PropertyService } from '@app/routes/workplaces/core/property/property.service';

@Component({
  selector: 'app-debtor-property-attributes',
  templateUrl: './property-attributes.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebtorPropertyAttributesComponent implements OnInit {

  entityId$: Observable<number>;
  readonly entityTypeId = EntityType.PROPERTY;

  tabs = [
    { title: 'debtor.propertyTab.attributes.title', isInitialised: true },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private propertyService: PropertyService,
    private debtorService: DebtorService) {}

  ngOnInit(): void {
    this.entityId$ = this.propertyService
      .getPayload<IProperty>(PropertyService.MESSAGE_PROPERTY_SELECTED)
      .map(property => property ? property.id : null)
      .do(_ => {
        this.debtorService.entityTypeId$.next(this.entityTypeId);
        this.cdRef.markForCheck();
      }
    );
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
    this.cdRef.markForCheck();
  }
}
