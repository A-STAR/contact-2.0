import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-debtor-promise',
  templateUrl: './promise.component.html'
})
export class DebtorPromiseComponent {
  static COMPONENT_NAME = 'DebtorPromiseComponent';

  constructor(
    private route: ActivatedRoute,
  ) {}

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get promiseId(): number {
    return this.routeParams.promiseId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
