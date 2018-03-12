import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { PipeTransform, Pipe } from '@angular/core';
import { of } from 'rxjs/observable/of';

import { IOption } from '@app/core/converter/value-converter.interface';
import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { FormsModule } from '@angular/forms';
import { DateTimeModule } from '@app/shared/components/form/datetime/datetime.module';
import { InputModule } from '@app/shared/components/form/input/input.module';
import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { SingleSelectModule } from '@app/shared/components/form/select/single/single-select.module';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { LookupService } from '@app/core/lookup/lookup.service';

import { SortOptionsPipe } from '@app/shared/components/form/select/select.pipe';

import { DateTimeEditComponent } from '@app/shared/components/grids/editors';
import { ValueEditorComponent } from './value.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

class TranslateServiceMock {
  defaultLang = 'ru';
  currentLang = 'ru';

  get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return of('Истина');
  }

  onLangChange: Observable<LangChangeEvent> = of(
    {
      lang: 'ru',
      translations: {
        default: {
          boolean: {
            TRUE: 'Истина',
            FALSE: 'Ложь'
          }
        }
      },
    }
  );
}

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return '';
  }
}
@Pipe({ name: 'sortOptionsPipe' })
export class SortOptionsPipeMock implements PipeTransform {

  transform(options: any[]): any[] {
    return options;
  }
}

class UserDictionariesServiceMock {
  getDictionary(dictCode: number): Observable<IUserTerm[]> {
    const terms = Array(10).fill(null).map((_, i) => i + 1).map(code => ({
      code,
      name: `Term ${code}`,
      isClosed: false,
      parentCode: null,
      parentDictTerm: null,
    }));
    return of(terms);
  }

  getDictionaryAsOptions(id: number): Observable<IOption[]> {
    let payload;
    switch (id) {
      case 2:
        payload = [
          {
            label: 'Истина',
            value: 1
          },
          {
            label: 'Ложь',
            value: 0
          }
        ];
        break;
      default:
        payload = [
          {
            label: 'One',
            value: 1
          },
          {
            label: 'Two',
            value: 2
          },
          {
            label: 'Three',
            value: 3
          }
        ];
    }
    return of(payload);
  }
}

class LookupServiceMock {
  lookupAsOptions(key: string): Observable<Array<IOption>> {
    return of(
      [
        {
          label: 'One',
          value: 1
        }
      ]
    );
  }
}

describe('ValueEditorComponent', () => {
  let fixture: ComponentFixture<ValueEditorComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        imports: [
          FormsModule,
          DateTimeModule,
          InputModule,
          MomentModule,
          SingleSelectModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        providers: [
          {
            provide: TranslateService,
            useClass: TranslateServiceMock
          },
          {
            provide: UserDictionariesService,
            useClass: UserDictionariesServiceMock
          },
          {
            provide: LookupService,
            useClass: LookupServiceMock
          },
          {
            provide: SortOptionsPipe,
            useClass: SortOptionsPipeMock
          }
        ],
        declarations: [
          DateTimeEditComponent,
          SortOptionsPipeMock,
          TranslatePipeMock,
          ValueEditorComponent,
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueEditorComponent);
  });

  it('should render value editor with typeCode 1 (number)', () => {
    fixture.componentInstance.agInit({
      value: 0,
      data: { typeCode: 1 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value editor with typeCode 2 (datepicker)', () => {
    fixture.componentInstance.agInit({
      value: '2017-06-20T21:00:00Z',
      data: { typeCode: 2 },
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

  it('should render value editor with typeCode 4 (boolean)', () => {
    fixture.componentInstance.agInit({
      value: true,
      data: { typeCode: 4 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value editor with typeCode 5 (float)', () => {
    fixture.componentInstance.agInit({
      value: 3.14,
      data: { typeCode: 5 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value editor with typeCode 6 (dictionary)', () => {
    fixture.componentInstance.agInit({
      value: 33,
      data: { typeCode: 6 },
      dictCode: 33,
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value editor with typeCode 6 (dictionary) using callback', () => {
    fixture.componentInstance.agInit({
      value: 33,
      data: { typeCode: 6, dictCode: 33 },
      dictCode: item => item.dictCode,
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  it('should render value editor with typeCode 7 (datetimepicker)', () => {
    fixture.componentInstance.agInit({
      value: '2017-06-20T21:00:00Z',
      data: { typeCode: 7 },
      valueTypeKey: 'typeCode',
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

});
