import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { HttpModule, Http } from '@angular/http';

import { createTranslateLoader } from '../../app.module';

import { SettingsService } from '../../core/settings/settings.service';
import { AuthService } from '../../core/auth/auth.service';

import { HeaderComponent } from './header.component';

describe('Component: Header', () => {
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [
              Http
            ]
          }
        })
      ],
      providers: [
        AuthHttp,
        AuthService,
        {
          provide: AuthConfig,
          useValue: new AuthConfig
        },
        {
          provide: JwtHelper,
          useValue: new JwtHelper
        },
        SettingsService,
        AuthService,
        TranslateService,
        {
          provide: Router,
          useValue: mockRouter
        }
      ]
    }).compileComponents();
  });

  it('should create an instance', async(inject(
    [SettingsService, AuthService, TranslateService],
    (settingsService, authService, translateService) => {
      const component = new HeaderComponent(settingsService, authService, translateService);
      expect(component).toBeTruthy();
  })));
});
