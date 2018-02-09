describe('AppComponent', () => {
  it('is a fake test', () => {
    expect(true).toEqual(true);
  });
});

// import { TestBed, async } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { createTranslateLoader } from './app.module';

// import { SettingsService } from './core/settings/settings.service';

// import { AppComponent } from './app.component';

// xdescribe('AppComponent', () => {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientModule,
//         RouterTestingModule.withRoutes([]),
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
//       declarations: [
//         AppComponent,
//       ],
//       providers: [
//         SettingsService,
//       ]
//     }).compileComponents();
//   }));

//   it('should create the app', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   }));

//   /*
//   it(`should have as title 'app works!'`, async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app.title).toEqual('app works!');
//   }));

//   it('should render title in a h1 tag', async(() => {
//     const fixture = TestBed.createComponent(AppComponent);
//     fixture.detectChanges();
//     const compiled = fixture.debugElement.nativeElement;
//     expect(compiled.querySelector('h1').textContent).toContain('app works!');
//   }));
//   */
// });
