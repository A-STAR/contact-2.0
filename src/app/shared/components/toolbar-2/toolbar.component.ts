import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IToolbarItem, IToolbar } from './toolbar-2.interface';
import { defaultTo } from 'ramda';
import { of } from 'rxjs/observable/of';

@Component({
  selector: 'app-toolbar',
  styleUrls: [ './toolbar.component.scss' ],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit {
  @Input() toolbar: IToolbar;
  @Input() toolbarClass: any;
  @Output() action = new EventEmitter<IToolbarItem>();

  borderCls: object;
  items: IToolbarItem[] = [];
  suppressCenterZone: boolean;
  label: string;

  ngOnInit(): void {
    const classesDefault = defaultTo(of(''));
    const enabledDefault = defaultTo(of(true));
    this.borderCls = { 'no-border': this.toolbar && this.toolbar.suppressBorder === true };
    this.items = ((this.toolbar && this.toolbar.items) || this.items).map(item => ({
      ...item,
      classes: classesDefault(item.classes),
      enabled: enabledDefault(item.enabled),
    }));
    this.suppressCenterZone = (this.toolbar && this.toolbar.suppressCenterZone) || false;
    this.label = (this.toolbar && this.toolbar.label) || '';
    this.borderCls = { 'no-border': this.toolbar && this.toolbar.suppressBorder === true };
  }

  onAction(item: IToolbarItem): void {
    this.action.emit(item);
  }
}
