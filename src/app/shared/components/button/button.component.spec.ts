import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { random } from 'faker';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IButtonStyle, IButtonType } from './button.interface';

import { ButtonService } from './button.service';

import { ButtonComponent } from './button.component';

const defaultButtonClass = random.uuid();
const defaultIconClass = random.uuid();
const defaultLabel = random.word();

class ButtonServiceMock {
  getIcon(type: IButtonType): string {
    return defaultIconClass;
  }

  getLabel(type: IButtonType): string {
    return defaultLabel;
  }

  getClass(style: IButtonStyle): string {
    return defaultButtonClass;
  }
}

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          ButtonComponent,
        ],
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        providers: [
          {
            provide: ButtonService,
            useClass: ButtonServiceMock,
          },
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
  });

  it('should render button', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });

  it('should render button with default css class', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button')).nativeElement.classList).toContain(defaultButtonClass);
  });

  it('should render button with default icon class', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button > i')).nativeElement.classList).toContain(defaultIconClass);
  });

  it('should render button with default label', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(defaultLabel);
  });

  it('should render button with custom icon class', () => {
    const customIconClass = random.uuid();
    fixture.componentInstance.icon = customIconClass;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button > i')).nativeElement.classList).toContain(customIconClass);
  });

  it('should render button with no label', () => {
    fixture.componentInstance.label = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button > span'))).toBeFalsy();
  });

  it('should render button with custom label', () => {
    const customLabel = random.word();
    fixture.componentInstance.label = customLabel;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(customLabel);
  });
});
