import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { DebtorService } from '@app/routes/workplaces/debtor-card/debtor.service';

@Component({
  selector: 'app-debtor-promise',
  templateUrl: './debtor-promise.component.html'
})
export class DebtorPromiseComponent {
  constructor(
    private debtorService: DebtorService,
    private route: ActivatedRoute,
  ) {}

  get debtId$(): Observable<number> {
    return this.debtorService.debtId$;
  }

  get promiseId(): number {
    return Number(this.route.snapshot.paramMap.get('promiseId'));
  }

}
