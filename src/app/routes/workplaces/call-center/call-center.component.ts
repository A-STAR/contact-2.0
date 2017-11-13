import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-call-center',
  templateUrl: 'call-center.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallCenterComponent {
  static COMPONENT_NAME = 'CallCenterComponent';
}
