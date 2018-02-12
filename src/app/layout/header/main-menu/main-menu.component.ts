import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { IMenuItem } from '@app/core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';

@Component({
  selector: 'app-header-main-menu',
  templateUrl: './main-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent {
  private _menuItems$ = this.guiObjectsService.menuItems;

  constructor(
    private guiObjectsService: GuiObjectsService
  ) {}

  get menuItems$(): Observable<IMenuItem[]> {
    return this._menuItems$.pipe(
      map(items => items.filter(item => !item.link.endsWith('help'))),
    );
  }
}
