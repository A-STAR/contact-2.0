import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { EntityType } from '@app/core/entity/entity.interface';
import { IPledgeContract } from '@app/routes/workplaces/core/pledge/pledge.interface';

import { DebtorService } from '../../debtor.service';
import { PledgeService } from '@app/routes/workplaces/core/pledge/pledge.service';

@Component({
  selector: 'app-debtor-pledge-attributes',
  templateUrl: './pledge-attributes.component.html',
  host: { class: 'full-size' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtorPledgeAttributesComponent implements OnInit {
  readonly entityTypeId = EntityType.PROPERTY;

  entityId$: Observable<number>;

  tabs = [
    { title: 'debtor.propertyTab.attributes.title', isInitialised: true },
  ];

  constructor(
    private cdRef: ChangeDetectorRef,
    private pledgeService: PledgeService,
    private debtorService: DebtorService
  ) {}

  ngOnInit(): void {
    this.entityId$ = this.pledgeService
      .getPayload<IPledgeContract>(PledgeService.MESSAGE_PLEDGE_CONTRACT_SELECTION_CHANGED)
      .map(pledge => pledge ? pledge.propertyId : null)
      .do(_ => {
          this.debtorService.entityTypeId$.next(this.entityTypeId);
          this.cdRef.markForCheck();
        }
      );
  }

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
