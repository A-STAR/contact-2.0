import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { MenuItemType } from '@app/routes/menu-config.interface';
import { IMenuItem } from '@app/core/gui-objects/gui-objects.interface';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';
import { HelpService } from '@app/core/help/help.service';

@Component({
  selector: 'app-header-main-menu',
  templateUrl: './main-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainMenuComponent {

  readonly menuItems$ = this.guiObjectsService.menuItems.pipe(
    map(items => items.filter(item => item.text)),
  );

  constructor(
    private guiObjectsService: GuiObjectsService,
    private helpService: HelpService,
  ) {}

  isHelpItem(item: IMenuItem): boolean {
    return item.type === MenuItemType.HELP;
  }

  onHelp(): void {
    this.helpService.open('');
  }
}
