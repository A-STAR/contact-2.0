import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-admin',
  templateUrl: 'admin.component.html'
})
export class AdminComponent {}
