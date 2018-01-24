import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ITab } from '@app/shared/components/layout/tabview/header/header.interface';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.groups.tabs');

@Component({
  selector: 'app-groups',
  host: { class: 'full-height' },
  templateUrl: './groups.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {

  tabs: ITab[] = [
    { link: '', title: label('groups') },
    { link: 'debts', title: label('debtsInGroup') },
  ];

}
