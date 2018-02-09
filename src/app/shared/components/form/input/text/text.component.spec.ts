import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { TextComponent } from './text.component';

describe('TextComponent', () => {
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          TextComponent,
        ],
        imports: [
          FormsModule,
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
  });

  it('should render', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should handle losing focus', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should handle input', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('input')).nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
