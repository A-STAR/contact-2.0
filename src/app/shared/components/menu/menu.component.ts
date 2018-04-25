import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ITitlebarElement } from '@app/shared/components/titlebar/titlebar.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() items: ITitlebarElement[];
  @Input() menuClass: string;

  @Output() action = new EventEmitter<ITitlebarElement>();

  constructor() { }

  ngOnInit(): void {
  }

  isDisabled(item: ITitlebarElement): Observable<boolean> {
    return item.enabled ? item.enabled.map(enabled => !enabled) : of(false);
  }

  onAction(item: ITitlebarElement): void {
    if (item.action && typeof item.action === 'function') {
      item.action(item);
    }
    if (this.action) {
      this.action.emit(item);
    }
  }

}
