import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ITab } from '@app/shared/components/layout/tabview/header/header.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-route-ui',
  styleUrls: [ './ui.component.scss' ],
  templateUrl: './ui.component.html'
})
export class UIComponent {
  tabs: ITab[] = [
    { link: 'inputs', title: 'Inputs' },
    { link: 'datetime', title: 'Date/Time' },
    { link: 'grids', title: 'Grids' },
    { link: 'icons', title: 'Icons' },
  ];
}
