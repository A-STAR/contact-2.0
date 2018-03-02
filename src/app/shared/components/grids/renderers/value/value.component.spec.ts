import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MomentModule } from '@app/shared/pipes/moment/moment.module';

import { ValueRendererComponent } from './value.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('ValueRendererComponent', () => {
  let fixture: ComponentFixture<ValueRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          MomentModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        declarations: [
          ValueRendererComponent,
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueRendererComponent);
  });

  it('should render value renderer with typeCode 1 (number)', () => {
    fixture.componentInstance.agInit({
      value: 0,
      data: { typeCode: 1 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value renderer with typeCode 3 (string)', () => {
    fixture.componentInstance.agInit({
      value: 'value',
      data: { typeCode: 3 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value renderer with typeCode 4 (boolean) and value = false', () => {
    fixture.componentInstance.agInit({
      value: false,
      data: { typeCode: 4 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value renderer with typeCode 4 (boolean) and value = true', () => {
    fixture.componentInstance.agInit({
      value: true,
      data: { typeCode: 4 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
