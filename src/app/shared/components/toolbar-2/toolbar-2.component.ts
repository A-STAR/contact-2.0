import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../core/state/state.interface';
import { IToolbarItem, IToolbarButton } from './toolbar-2.interface';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ]
})
export class Toolbar2Component implements OnInit {
  @Input() items: Array<IToolbarItem> = [];

  private items$: Observable<Array<IToolbarButton>>;

  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    this.items$ = this.store.map(state =>
      this.items.map(item => ({
        ...item,
        disabled: typeof item.disabled === 'boolean' ? item.disabled : item.disabled(state)
      }))
    );
  }

  get buttons$(): Observable<Array<IToolbarButton>> {
    return this.items$;
  }

  onClick(item: IToolbarItem): void {
    this.store.dispatch({
      type: item.action
    });
  }
}
