import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-icons',
  templateUrl: './icons.component.html',
  styleUrls: [ 'style.css', 'icons.css' ],
})
export class IconsComponent {

}
