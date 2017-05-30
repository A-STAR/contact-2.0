import { Component, Input } from '@angular/core';

import { ContentTabService } from './tab/content-tab.service';
import { ITab } from './tab/content-tab.interface';

@Component({
  selector: 'app-content-tabstrip',
  templateUrl: 'content-tabstrip.component.html',
  styleUrls: ['./content-tabstrip.component.scss']
})

export class ContentTabstripComponent {
  @Input() tabs: ITab[];

  constructor(private tabService: ContentTabService) { }

  isClosable(tab: ITab): boolean {
    return this.tabs.length > 1;
  }

  onSelectTab(i: number): void {
    this.tabService.setActiveIndex(i);
  }

  onClose(event: UIEvent, i: number): void {
    event.preventDefault();
    event.stopPropagation();
    this.tabService.removeTab(i);
  }
}
