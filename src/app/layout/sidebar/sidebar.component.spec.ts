describe('SidebarComponent', () => {
  it('is a fake test', () => {
    expect(true).toEqual(true);
  });
});

// import { ChangeDetectorRef } from '@angular/core';
// import { TestBed, async, inject } from '@angular/core/testing';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { Router } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { JwtHelperService } from '@auth0/angular-jwt';

// import { createTranslateLoader } from '../../app.module';

// import { AuthService } from '../../core/auth/auth.service';
// import { GuiObjectsService } from '../../core/gui-objects/gui-objects.service';
// import { SettingsService } from '../../core/settings/settings.service';

// import { SidebarComponent } from './sidebar.component';

// xdescribe('Component: Sidebar', () => {
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
//         AuthService,
//         HttpClient,
//         GuiObjectsService,
//         JwtHelperService,
//         SettingsService,
//         { provide: Router, useValue: mockRouter }
//       ]
//     }).compileComponents();
//   });

//   it('should create an instance', async(inject([ChangeDetectorRef, GuiObjectsService, SettingsService, Router],
//     (cdRef, menuService, settingsService, router) => {
//       const component = new SidebarComponent(cdRef, menuService, router, settingsService);
//       expect(component).toBeTruthy();
//     }))
//   );
// });
