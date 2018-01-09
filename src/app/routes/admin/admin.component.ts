import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {}
