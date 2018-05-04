import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostBinding,  } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToasterConfig } from 'angular2-toaster';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

import { AuthService } from './core/auth/auth.service';
import { DataService } from './core/data/data.service';
import { PersistenceService } from './core/persistence/persistence.service';
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
  static LOADER_DEBOUNCE_INTERVAL = 200;

  toasterConfig = new ToasterConfig({
    animation: 'slideUp',
    limit: 10,
    mouseoverTimerStop: true,
    positionClass: 'toaster-container',
  });

  private _isLoading$: Observable<boolean>;

  @HostBinding('class.aside-collapsed') get isCollapsed(): boolean {
    return this.settings.layout.isCollapsed as boolean;
  }

  get isLoading$(): any {
    return this._isLoading$;
  }

  constructor(
    private dataService: DataService,
    private router: Router,
    private persistenceService: PersistenceService,
    public settings: SettingsService,
    private translateService: TranslateService
  ) {
    // set default to 'en' if no language is found
    const language = this.persistenceService.get(AuthService.LANGUAGE_TOKEN) || 'en';
    // NOTE: the default language is then taken from the user profile
    // and reset after successful authentication
    this.translateService.setDefaultLang(language);
    this.translateService.use(language).subscribe();

    this._isLoading$ = combineLatest(
      this.dataService.isLoading$,
      this.router.events,
      (isLoading, event) => isLoading || !(event instanceof NavigationEnd)
    )
    .pipe(
      distinctUntilChanged(),
      debounceTime(AppComponent.LOADER_DEBOUNCE_INTERVAL)
    );
  }
}
