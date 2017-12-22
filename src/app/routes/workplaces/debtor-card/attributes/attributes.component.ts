import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-attributes',
  templateUrl: './attributes.component.html'
})
export class DebtorAttributesComponent implements OnInit {
  static COMPONENT_NAME = 'DebtorAttributesComponent';
  static ENTITY_TYPE_DEBT = 19;

  entityTypeId$: Observable<number>;
  entityId$: Observable<number>;

  constructor(
    private debtorCardService: DebtorCardService,
  ) {}

  ngOnInit(): void {
    this.entityId$ = this.debtorCardService.selectedDebtId$;
    this.entityTypeId$ = of(DebtorAttributesComponent.ENTITY_TYPE_DEBT);
  }
}
