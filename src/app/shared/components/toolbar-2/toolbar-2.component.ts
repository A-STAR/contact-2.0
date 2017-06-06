import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../core/state/state.interface';
import { IToolbarItem, IToolbarButton } from './toolbar-2.interface';

import { PermissionsService } from '../../../core/permissions/permissions.service';

@Component({
  selector: 'app-toolbar-2',
  templateUrl: './toolbar-2.component.html',
  styleUrls: [ './toolbar-2.component.scss' ]
})
export class Toolbar2Component implements OnInit {
  @Input() items: Array<IToolbarItem> = [];

  private items$: Observable<Array<IToolbarButton>>;

  constructor(
    private permissionsService: PermissionsService,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this.items$ = this.store.map(state =>
      this.items.map(item => ({
        ...item,
        // TODO: maybe use hasPermission2 with zip?
        disabled: this.isDisabled(item, state) || !this.permissionsService.hasAllPermissions(item.permissions)
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

  private isDisabled(item: IToolbarItem, state: IAppState): boolean {
    return typeof item.disabled === 'boolean' ? item.disabled : item.disabled(state);
  }
}
