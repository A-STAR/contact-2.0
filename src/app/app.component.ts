import { Component, HostBinding } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToasterConfig } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';

import { GridService } from './shared/components/grid/grid.service';
import { SettingsService } from './core/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  static USER_LANGUAGE = 'user/language';

  toasterConfig = new ToasterConfig({
    animationClass: 'flyLeft',
    limit: 10,
    mouseoverTimerStop: true,
    positionClass: 'toast-bottom-right',
  });

  @HostBinding('class.aside-collapsed') get isCollapsed(): boolean {
    return this.settings.layout.isCollapsed as boolean;
  };

  get isLoading$(): Observable<boolean> {
    return this.gridService.isLoading$;
  }

  constructor(
    private gridService: GridService,
    public settings: SettingsService,
    private translateService: TranslateService
  ) {
    // set default to 'en' if no language is found
    const language = localStorage.getItem(AppComponent.USER_LANGUAGE) || 'en';
    // NOTE: the default language is then taken from the user profile
    // and reset after successful authentication
    translateService.setDefaultLang(language);
    translateService.use(language).subscribe();
  }
}
