import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-debtor-information-address-grid',
  templateUrl: 'address-grid.component.html'
})
export class AddressGridComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get personId(): number {
    return this.routeParams.contactId || this.routeParams.personId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
