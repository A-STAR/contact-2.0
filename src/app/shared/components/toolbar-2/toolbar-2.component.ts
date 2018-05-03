import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IToolbarItem } from './toolbar-2.interface';

@Component({
  selector: 'app-toolbar-2',
  styleUrls: [ './toolbar-2.component.scss' ],
  templateUrl: './toolbar-2.component.html',
})
export class Toolbar2Component {
  @Input() items: IToolbarItem[] = [];
  @Input() toolbarClass: any;
  @Output() action = new EventEmitter<IToolbarItem>();

  onAction(item: IToolbarItem): void {
    this.action.emit(item);
  }
}
