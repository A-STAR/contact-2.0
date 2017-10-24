import { TestBed, inject } from '@angular/core/testing';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { createTranslateLoader } from '../../app.module';

import { AuthService } from '../auth/auth.service';
import { GuiObjectsService } from './gui-objects.service';

describe('Service: Menu', () => {
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [
              HttpClient
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
        {
          provide: Router,
          useValue: mockRouter
        },
        GuiObjectsService,
      ]
    });
  });

  it('should ...', inject([GuiObjectsService], (service: GuiObjectsService) => {
    expect(service).toBeTruthy();
  }));
});
