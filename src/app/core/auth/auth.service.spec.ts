import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthHttp, AuthConfig, JwtHelper } from 'angular2-jwt';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { createTranslateLoader } from '../../app.module';

import { AuthService } from './auth.service';

describe('AuthService', () => {
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
        }
      ]
    });
  });

  it('should ...', inject([AuthService], (service: AuthService) => {
    expect(service).toBeTruthy();
  }));
});
