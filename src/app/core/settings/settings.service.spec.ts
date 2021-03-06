import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { filter, first } from 'rxjs/operators';

import { IUser } from '@app/core/auth/auth.interface';

import { AuthService } from '@app/core/auth/auth.service';
import { PersistenceService } from '@app/core/persistence/persistence.service';
import { SettingsService } from '@app/core/settings/settings.service';

Object.defineProperty(window, '$', { value: () => true });
const SETTINGS_KEY = 'SETTINGS_KEY';
const SETTINGS = { testSetting: 'testSettingValue', [SettingsService.REDIRECT_TOKEN]: 'testRedirect' };
const AUTH_USER = { userId: 1, userName: SETTINGS_KEY };

class MockAuthService {
  get currentUser$(): Observable<IUser> {
    return of(AUTH_USER);
  }
}

class MockPersistenceService {
  getOr(settingsKey: string): any {
    return settingsKey === SETTINGS_KEY ? { ...SETTINGS } : {};
  }

  set(): void {
  }

  remove(): void {
  }
}

class MockRouter {
  navigate(): void {
  }
}

describe('SettingsService', () => {
  let service: SettingsService;
  let persistenceService: PersistenceService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
        {
          provide: PersistenceService,
          useClass: MockPersistenceService,
        },
        {
          provide: Router,
          useClass: MockRouter,
        },
      ],
    });
    service = TestBed.get(SettingsService);
    persistenceService = TestBed.get(PersistenceService);
    router = TestBed.get(Router);
  });

  it('should initialize', () => {
    expect(service).toBeDefined();
  });

  it('should get settings', () => {
    const result = service.get('testSetting');

    expect(result).toEqual(SETTINGS['testSetting']);
  });

  it('should set settings', () => {
    const spy = spyOn(persistenceService, 'set');

    service.set('testSetting', SETTINGS['testSetting']);

    expect(spy).toHaveBeenCalledWith(SETTINGS_KEY, SETTINGS);
  });

  it('should remove settings', () => {
    const spy = spyOn(persistenceService, 'set');

    service.remove('testSetting');

    expect(spy).toHaveBeenCalledWith(SETTINGS_KEY, {
      [SettingsService.REDIRECT_TOKEN]: SETTINGS[SettingsService.REDIRECT_TOKEN]
    });
  });

  it('should redirect after login', () => {
    const spy = spyOn(router, 'navigate')
      .and
      .returnValue(Promise.resolve());

    service.redirectAfterLogin();

    expect(spy).toHaveBeenCalledWith([ SETTINGS[SettingsService.REDIRECT_TOKEN] ]);
  });

  it('should clear settings', () => {
    const spy = spyOn(persistenceService, 'remove');

    service.clear();

    expect(spy).toHaveBeenCalledWith(SETTINGS_KEY);
  });
});
