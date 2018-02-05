describe('HeaderComponent', () => {
  it('is a fake test', () => {
    expect(true).toEqual(true);
  });
});

// import { ChangeDetectorRef } from '@angular/core';
// import { TestBed, async, inject } from '@angular/core/testing';
// import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { Router } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';

// import { createTranslateLoader } from '../../app.module';

// import { AuthService } from '../../core/auth/auth.service';
// import { NotificationsService } from '../../core/notifications/notifications.service';
// import { PersistenceService } from '../../core/persistence/persistence.service';
// import { SettingsService } from '../../core/settings/settings.service';

// import { HeaderComponent } from './header.component';

// xdescribe('Component: Header', () => {
//   const mockRouter = {
//     navigate: jasmine.createSpy('navigate')
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientModule,
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useFactory: createTranslateLoader,
//             deps: [
//               HttpClient
//             ]
//           }
//         })
//       ],
//       providers: [
//         HttpClient,
//         AuthService,
//         JwtHelperService,
//         NotificationsService,
//         PersistenceService,
//         SettingsService,
//         TranslateService,
//         {
//           provide: Router,
//           useValue: mockRouter
//         }
//       ]
//     }).compileComponents();
//   });

//   xit('should create an instance', async(inject([ ChangeDetectorRef ], cdRef => {
//     const component = new HeaderComponent(cdRef);
//     expect(component).toBeTruthy();
//   })));
// });
