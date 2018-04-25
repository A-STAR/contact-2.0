import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-licence-popup',
  templateUrl: 'licence.component.html'
})
export class LicenceComponent {}
