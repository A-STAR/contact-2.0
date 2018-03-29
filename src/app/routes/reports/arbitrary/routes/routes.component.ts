import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-arbitrary-reports-routes',
  templateUrl: './routes.component.html',
})
export class ArbitraryReportsRoutesComponent {
}
