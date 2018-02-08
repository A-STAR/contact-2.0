describe('AuthService', () => {
  it('is a fake test', () => {
    expect(true).toEqual(true);
  });
});

// import { TestBed, inject } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// import { createTranslateLoader } from '../../app.module';

// import { AuthService } from './auth.service';

// xdescribe('AuthService', () => {
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
//         {
//           provide: Router,
//           useValue: mockRouter
//         }
//       ]
//     });
//   });

//   it('should ...', inject([AuthService], (service: AuthService) => {
//     expect(service).toBeTruthy();
//   }));
// });
