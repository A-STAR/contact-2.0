import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ITab } from './header.interface';

@Component({
  selector: 'app-tabview-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabHeaderComponent {
  @Input() noMargin = false;
  @Input() tabs: ITab[] = [];
}
