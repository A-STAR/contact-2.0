import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

interface PhoneCardRouteParams {
  personId: number;
  phoneId: number;
}

@Component({
  selector: 'app-incoming-call-phone-card',
  templateUrl: './phone-card.component.html'
})
export class PhoneCardComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get phoneId$(): Observable<number> {
    return this.routeParams$.map(params => params.phoneId);
  }

  get entityId$(): Observable<number> {
    return this.routeParams$.map(params => params.personId);
  }

  get routeParams$(): Observable<PhoneCardRouteParams> {
    return this.route.params as Observable<PhoneCardRouteParams>;
  }
}
