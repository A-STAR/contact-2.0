import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

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
  getOr(): any {
    return {};
  }

  set(): void {
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
    const spy = spyOn(persistenceService, 'getOr')
      .and
      .callFake(settingsKey => settingsKey === SETTINGS_KEY ? { ...SETTINGS } : {});

    const result = service.get('testSetting');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(SETTINGS['testSetting']);
  });

  it('should set settings', () => {
    const spyGet = spyOn(persistenceService, 'getOr')
    .and
    .callFake(settingsKey => settingsKey === SETTINGS_KEY ? { ...SETTINGS } : {});

    const spySet = spyOn(persistenceService, 'set');

    service.set('testSetting', SETTINGS['testSetting']);

    expect(spyGet).toHaveBeenCalledTimes(1);
    expect(spySet).toHaveBeenCalledWith(SETTINGS_KEY, SETTINGS);
  });

  it('should remove settings', () => {
    const spyGet = spyOn(persistenceService, 'getOr')
      .and
      .callFake(settingsKey => settingsKey === SETTINGS_KEY ? { ...SETTINGS } : {});

    const spySet = spyOn(persistenceService, 'set');

    service.remove('testSetting');

    expect(spyGet).toHaveBeenCalledTimes(1);
    expect(spySet).toHaveBeenCalledWith(SETTINGS_KEY, {
      [SettingsService.REDIRECT_TOKEN]: SETTINGS[SettingsService.REDIRECT_TOKEN]
    });
  });

  it('should redirect after login', () => {
    const spyGet = spyOn(persistenceService, 'getOr')
      .and
      .callFake(settingsKey => settingsKey === SETTINGS_KEY ? { ...SETTINGS } : {});

    const spyNavigate = spyOn(router, 'navigate')
      .and
      .returnValue(Promise.resolve());

    service.redirectAfterLogin();

    expect(spyGet).toHaveBeenCalledTimes(1);
    expect(spyNavigate).toHaveBeenCalledWith([ SETTINGS[SettingsService.REDIRECT_TOKEN] ]);
  });
});
