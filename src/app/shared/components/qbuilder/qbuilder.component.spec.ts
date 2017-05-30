import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TextMaskModule } from 'angular2-text-mask';

import { createTranslateLoader } from '../../../app.module';

import { DatePickerModule } from '../form/datepicker/datepicker.module';

import { QBuilderService } from './qbuilder.service';
import { QBuilderComponent } from './qbuilder.component';

import { NumericInputComponent } from '../form/numeric-input/numeric-input.component';

describe('QbuilderComponent', () => {
  let component: QBuilderComponent;
  let fixture: ComponentFixture<QBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DatePickerModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        TextMaskModule,
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
      declarations: [
        NumericInputComponent,
        QBuilderComponent,
      ],
      providers: [
        QBuilderService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
