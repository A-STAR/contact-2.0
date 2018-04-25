import { TestBed, inject } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DictPipe } from './dict.pipe';

class MockUserDictionariesService {
  getDictionary(id: number): Observable<IUserTerm[]> {
    const dicts = {
      34: [
        {
          code: 1,
          name: 'Test1',
          isClosed: false,
          parentDictTerm: null,
          parentCode: null
        },
        {
          code: 2,
          name: 'Test2',
          isClosed: false,
          parentDictTerm: null,
          parentCode: null
        },
      ],
      35: [
        {
          code: 1,
          name: 'Test3',
          isClosed: false,
          parentDictTerm: null,
          parentCode: null
        },
      ],
    };
    return of(dicts[id]);
  }
}

class MockTranslateService {
  onLangChange = of(false);
}

class MockChangeDetector {
  markForCheck(): void {}
}

describe('DictPipe', () => {
  let pipe: DictPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DictPipe,
        {
          provide: TranslateService,
          useClass: MockTranslateService,
        },
        {
          provide: UserDictionariesService,
          useClass: MockUserDictionariesService,
        },
        {
          provide: ChangeDetectorRef,
          useClass: MockChangeDetector,
        }
      ],
      declarations: [ DictPipe ],
    });
  });

  beforeEach(inject([DictPipe], p => {
      pipe = p;
    })
  );

  it('should transform value by dictCode', () => {
    expect(pipe.transform(1, 34)).toBe('Test1');
    expect(pipe.transform(2, 34)).toBe('Test2');
  });

  it('should return empty string when any of arguments is not present', () => {
    expect(pipe.transform(1, null)).toBe('');
    expect(pipe.transform(null, 34)).toBe('');
  });

  it('should return empty string when value was not found', () => {
    expect(pipe.transform(9999, 34)).toBe('');
  });

  it('should return correct value, when dictCode is changed', () => {
    expect(pipe.transform(1, 34)).toBe('Test1');
    expect(pipe.transform(1, 35)).toBe('Test3');
  });
});
