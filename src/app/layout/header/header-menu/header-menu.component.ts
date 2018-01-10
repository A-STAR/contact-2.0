import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IMenuItem } from '../../../core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '../../../core/gui-objects/gui-objects.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: [ './header-menu.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderMenuComponent {
  private _menuItems$ = this.guiObjectsService.menuItems;

  constructor(
    private guiObjectsService: GuiObjectsService
  ) {}

  get menuItems$(): Observable<IMenuItem[]> {
    return this._menuItems$;
  }
}
