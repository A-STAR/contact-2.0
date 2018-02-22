import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { EmptyOverlayComponent } from './empty.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('EmptyOverlayComponent', () => {
  let fixture: ComponentFixture<EmptyOverlayComponent>;

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
          EmptyOverlayComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyOverlayComponent);
  });

  it('should render empty overlay', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
