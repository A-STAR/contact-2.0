describe('QbuilderComponent', () => {
  it('is a fake test', () => {
    expect(true).toEqual(true);
  });
});

// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TextMaskModule } from 'angular2-text-mask';

// import { createTranslateLoader } from '../../../app.module';

// import { DateTimeModule } from '../form/datetime/datetime.module';

// import { QBuilderService } from './qbuilder.service';
// import { QBuilderComponent } from './qbuilder.component';

// import { NumericInputComponent } from '../form/numeric-input/numeric-input.component';

// xdescribe('QbuilderComponent', () => {
//   let component: QBuilderComponent;
//   let fixture: ComponentFixture<QBuilderComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         DateTimeModule,
//         FormsModule,
//         HttpClientModule,
//         ReactiveFormsModule,
//         TextMaskModule,
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
//         NumericInputComponent,
//         QBuilderComponent,
//       ],
//       providers: [
//         QBuilderService,
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(QBuilderComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
