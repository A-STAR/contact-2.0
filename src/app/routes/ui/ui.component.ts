import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui',
  styleUrls: [ './ui.component.scss' ],
  templateUrl: './ui.component.html'
})
export class UIComponent {
  now = new Date();
}
