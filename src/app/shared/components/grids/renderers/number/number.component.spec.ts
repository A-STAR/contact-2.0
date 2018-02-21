import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { NumberRendererComponent } from './number.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('NumberRendererComponent', () => {
  let fixture: ComponentFixture<NumberRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          FormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        declarations: [
          NumberRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberRendererComponent);
  });

  it('should render number renderer', () => {
    fixture.componentInstance.agInit({ value: 1 } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
