import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { MomentModule } from '@app/shared/pipes/moment/moment.module';

import { IValueEntity } from '@app/core/converter/value-converter.interface';

import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { ValueRendererComponent } from './value.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

class ValueConverterServiceMock {
  deserialize(valueEntity: IValueEntity): IValueEntity {
    valueEntity.value = '';
    return valueEntity;
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
        providers: [
          {
            provide: ValueConverterService,
            useClass: ValueConverterServiceMock
          }
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

  it('should render value renderer with typeCode 4 (boolean) and value = 0', () => {
    fixture.componentInstance.agInit({
      value: 0,
      data: { typeCode: 4 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value renderer with typeCode 4 (boolean) and value = 1', () => {
    fixture.componentInstance.agInit({
      value: 1,
      data: { typeCode: 4 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
