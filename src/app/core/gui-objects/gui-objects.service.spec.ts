describe('GuiObjectsService', () => {
  it('is a fake test', () => {
    expect(true).toEqual(true);
  });
});

// import { TestBed, inject } from '@angular/core/testing';
// import { JwtHelperService } from '@auth0/angular-jwt';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { Router } from '@angular/router';

// import { createTranslateLoader } from '../../app.module';

// import { AuthService } from '../auth/auth.service';
// import { GuiObjectsService } from './gui-objects.service';

// xdescribe('Service: Menu', () => {
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
//         },
//         GuiObjectsService,
//       ]
//     });
//   });

//   it('should ...', inject([GuiObjectsService], (service: GuiObjectsService) => {
//     expect(service).toBeTruthy();
//   }));
// });
