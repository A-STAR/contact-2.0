import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ToolbarElement } from '@app/shared/components/toolbar/toolbar.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() items: ToolbarElement[];
  @Input() menuClass: string;

  @Output() action = new EventEmitter<ToolbarElement>();

  constructor() { }

  ngOnInit(): void {
  }

  isDisabled(item: ToolbarElement): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  onAction(item: ToolbarElement): void {
    if (item.action && typeof item.action === 'function') {
      item.action(item);
    }
    if (this.action) {
      this.action.emit(item);
    }
  }

}
