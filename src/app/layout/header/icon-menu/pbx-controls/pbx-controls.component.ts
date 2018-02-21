import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pbx-controls',
  templateUrl: './pbx-controls.component.html',
  styleUrls: [ './pbx-controls.component.scss' ]
})
export class PbxControlsComponent {
}
