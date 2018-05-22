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

  readonly debtId$: Observable<number> = this.debtorService.debtId$;

  readonly promiseId = Number(this.route.snapshot.paramMap.get('promiseId'));

}
