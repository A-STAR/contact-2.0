import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ButtonService } from './button.service';

import { ButtonComponent } from './button.component';

class ButtonServiceMock {
  getIcon(): string {
    return 'default-icon-class';
  }

  getLabel(): string {
    return 'default-label';
  }

  getClass(): string {
    return 'default-button-class';
  }
}

class TranslateLoaderMock {
  getTranslation(): Observable<any> {
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
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render button with custom icon class', () => {
    fixture.componentInstance.icon = 'custom-icon-class';
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render button with no label', () => {
    fixture.componentInstance.label = false;
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render button with custom label', () => {
    fixture.componentInstance.label = 'Custom Label';
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
