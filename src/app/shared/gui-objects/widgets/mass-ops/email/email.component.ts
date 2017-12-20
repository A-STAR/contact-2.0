import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mass-email',
  templateUrl: 'email.component.html'
})
export class EmailComponent {

}
