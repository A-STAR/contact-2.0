import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { TextComponent } from './text.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('TextComponent', () => {
  let fixture: ComponentFixture<TextComponent>;
  let input: HTMLInputElement;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          TextComponent,
        ],
        imports: [
          FormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should render', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should handle losing focus', () => {
    fixture.detectChanges();
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should handle input', async () => {
    fixture.detectChanges();
    input.value = 'a';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
