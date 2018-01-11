import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-admin',
  styleUrls: [ './admin.component.scss' ],
  templateUrl: 'admin.component.html'
})
export class AdminComponent {}
