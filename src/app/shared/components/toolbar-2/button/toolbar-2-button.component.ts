import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { IAppState } from '../../../../core/state/state.interface';

type TDisplay = (state: IAppState) => boolean | boolean;

@Component({
  selector: 'app-toolbar-2-button',
  templateUrl: './toolbar-2-button.component.html'
})
export class Toolbar2ButtonComponent {
  @Input() action: string = null;
  @Input() icon: string = null;
  @Input() label: string = null;
  @Input() permissions: string | Array<string> = null;

  private isDisabled$: Observable<boolean>;

  @Input() disabled: TDisplay = () => false;

  constructor(private store: Store<IAppState>) {
    this.isDisabled$ = this.store.map(state => this.disabled(state) || !this.hasPermissions());
  }

  get isDisabled(): Observable<boolean> {
    return this.isDisabled$;
  }

  onClick(): void {
    this.store.dispatch({
      type: this.action
    });
  }

  private hasPermissions(): boolean {
    return true;
  }
}
