import { Component } from '@angular/core';

import { makeKey } from '../../../core/utils';

const label = makeKey('dictionaries.tabs');

@Component({
  host: { class: 'full-height' },
  selector: 'app-dictionaries',
  templateUrl: './dictionaries.component.html',
  styleUrls: ['./dictionaries.component.scss'],
})
export class DictionariesComponent {
  tabs = [
    { title: label('dictionaries'), isInitialised: true },
    { title: label('attributes'), isInitialised: false },
  ];

  onTabSelect(tabIndex: number): void {
    this.tabs[tabIndex].isInitialised = true;
  }
}
