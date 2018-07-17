import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, HostBinding, NgZone } from '@angular/core';
import { NavigationEnd, Router, NavigationCancel } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToasterConfig } from 'angular2-toaster';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  readonly toasterConfig = new ToasterConfig({
    animation: 'slideUp',
    limit: 10,
    mouseoverTimerStop: true,
    positionClass: 'toaster-container',
  });

  isLoading = false;

  @HostBinding('class.aside-collapsed') get isCollapsed(): boolean {
    return this.settings.layout.isCollapsed as boolean;
  }

  constructor(
    private cdRef: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router,
    private persistenceService: PersistenceService,
    public settings: SettingsService,
    private translateService: TranslateService,
    private zone: NgZone,
  ) {
    // set default to 'en' if no language is found
    const language = this.persistenceService.get(AuthService.LANGUAGE_TOKEN) || 'en';
    // NOTE: the default language is then taken from the user profile
    // and reset after successful authentication
    this.translateService.setDefaultLang(language);
    this.translateService.use(language).subscribe();

    combineLatest(
      this.dataService.isLoading$,
      this.router.events,
      (isLoading, event) => isLoading || !(event instanceof NavigationEnd || event instanceof NavigationCancel)
    )
    .pipe(
      distinctUntilChanged(),
      debounceTime(AppComponent.LOADER_DEBOUNCE_INTERVAL),
    )
    .subscribe(isLoading => {
      this.zone.run(() => {
        this.isLoading = isLoading;
        this.cdRef.markForCheck();
      });
    });
  }
}
