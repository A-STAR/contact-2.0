import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IEntityTranslation } from '@app/core/entity/translations/entity-translations.interface';
import { ILookupLanguage } from '@app/core/lookup/lookup.interface';

import { DataService } from '@app/core/data/data.service';
import { LookupService } from '@app/core/lookup/lookup.service';

import { MultiLanguageComponent } from './multilanguage.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

class DataServiceMock {
  readTranslations(entityId: number, entityAttributeId: number): Observable<IEntityTranslation[]> {
    return of([
      { languageId: 1, value: 'Value for language 1' },
      { languageId: 2, value: 'Value for language 2' },
    ]);
  }
}

class LookupServiceMock {
  lookup(key: string): Observable<ILookupLanguage[]> {
    return of([
      { id: 1, name: 'Language 1', isMain: 1 },
      { id: 2, name: 'Language 2', isMain: 0 },
    ]);
  }
}

describe('MultiLanguageComponent', () => {
  let fixture: ComponentFixture<MultiLanguageComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          MultiLanguageComponent,
        ],
        imports: [
          FormsModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        providers: [
          {
            provide: DataService,
            useClass: DataServiceMock,
          },
          {
            provide: LookupService,
            useClass: LookupServiceMock,
          },
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLanguageComponent);
  });

  it('should render', () => {
    fixture.componentInstance.langConfig = {
      entityId: 1,
      entityAttributeId: 1,
    };
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
