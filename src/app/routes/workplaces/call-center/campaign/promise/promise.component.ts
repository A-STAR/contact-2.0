import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-call-center-promise',
  templateUrl: 'promise.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseComponent {
  constructor(
    private route: ActivatedRoute,
  ) {}

  get debtId(): Observable<number> {
    return this.routeParams.debtId;
  }

  get promiseId(): number {
    return this.routeParams.promiseId;
  }

  private get routeParams(): any {
    return (this.route.params as any).value;
  }
}
