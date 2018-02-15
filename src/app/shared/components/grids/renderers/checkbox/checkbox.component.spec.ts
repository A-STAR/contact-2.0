import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { CheckModule } from '@app/shared/components/form/check/check.module';

import { CheckboxCellRendererComponent } from './checkbox.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('CheckboxCellRendererComponent', () => {
  let fixture: ComponentFixture<CheckboxCellRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          CheckModule,
          FormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        declarations: [
          CheckboxCellRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxCellRendererComponent);
  });

  it('should render checkbox renderer', () => {
    fixture.componentInstance.agInit({
      node: {
        setDataValue: () => {},
      },
      value: false,
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
