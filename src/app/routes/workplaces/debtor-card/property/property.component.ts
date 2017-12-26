import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorCardService } from '../../../../core/app-modules/debtor-card/debtor-card.service';

@Component({
  selector: 'app-debtor-property',
  templateUrl: './property.component.html'
})
export class DebtorPropertyComponent {
  static COMPONENT_NAME = 'DebtorPropertyComponent';

  constructor(
    private debtorCardService: DebtorCardService,
    private route: ActivatedRoute,
  ) {}

  get personId$(): Observable<number> {
    return this.debtorCardService.personId$;
  }

  get propertyId(): number {
    return Number(this.route.snapshot.paramMap.get('propertyId'));
  }
}
