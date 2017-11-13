import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact-card-phone-grid',
  templateUrl: 'phone-grid.component.html'
})
export class PhoneGridComponent {
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
