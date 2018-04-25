import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { GuiObjectsService } from '@app/core/gui-objects/gui-objects.service';

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
    private guiObjectsService: GuiObjectsService
  ) {}
}
