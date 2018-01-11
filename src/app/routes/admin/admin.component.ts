import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-admin',
  styles: [ ':host { height: 100% }' ],
  templateUrl: 'admin.component.html'
})
export class AdminComponent {}
