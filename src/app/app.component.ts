import { Component, HostBinding, animate, state, style, transition, trigger } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToasterConfig } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

import { GridService } from './shared/components/grid/grid.service';
import { SettingsService } from './core/settings/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'isLoading', [
        state('void', style({ opacity: 0 })),
        state('*', style({ opacity: 1 })),
        transition(':enter', animate('100ms ease')),
        transition(':leave', animate('100ms ease')),
      ]
    )
  ]
})
export class AppComponent {
  static USER_LANGUAGE = 'user/language';

  static LOADER_DEBOUNCE_INTERVAL = 200;

  toasterConfig = new ToasterConfig({
    animationClass: 'flyLeft',
    limit: 10,
    mouseoverTimerStop: true,
    positionClass: 'toast-bottom-right',
  });

  private _isLoading$: Observable<boolean>;

  @HostBinding('class.aside-collapsed') get isCollapsed(): boolean {
    return this.settings.layout.isCollapsed as boolean;
  };

  get isLoading$(): any {
    return this._isLoading$;
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

    this._isLoading$ = this.gridService.isLoading$.debounceTime(AppComponent.LOADER_DEBOUNCE_INTERVAL);
  }
}
