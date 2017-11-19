import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-call-center-promise',
  templateUrl: 'promise.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromiseComponent {
  static COMPONENT_NAME = 'DebtorPromiseComponent';
}
