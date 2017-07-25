import { TestBed, async, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { HttpModule, Http } from '@angular/http';

import { createTranslateLoader } from '../../app.module';

import { AuthService } from '../../core/auth/auth.service';
import { GuiObjectsService } from '../../core/gui-objects/gui-objects.service';
import { SettingsService } from '../../core/settings/settings.service';

import { SidebarComponent } from './sidebar.component';

describe('Component: Sidebar', () => {
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
        GuiObjectsService,
        SettingsService,
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  it('should create an instance', async(inject([GuiObjectsService, SettingsService, Router], (menuService, settingsService, router) => {
    const component = new SidebarComponent(menuService, settingsService, router);
    expect(component).toBeTruthy();
  })));
});
