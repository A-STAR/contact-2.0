import { TestBed, inject } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { LookupPipe } from './lookup.pipe';
import { LookupService } from '@app/core/lookup/lookup.service';
import { ILookupKey } from '@app/core/lookup/lookup.interface';

class MockTranslateService {
  onLangChange = of(false);
}

class MockChangeDetector {
  markForCheck(): void {}
}

class MockLookupService {
  lookup(key: ILookupKey): Observable<any[]> {
    const lookups = {
      roles: [
        { code: 1, name: 'Test1' },
        { code: 2, name: 'Test2' },
      ],
      users: [
        { customProp: 3, customOutput: 'Test3' },
        { customProp: 4, customOutput: 'Test4' },
      ],
      contractors: [
        { code: 1, output: 'Test5' },
        { code: 2, output: 'Test6' },
      ],
      languages: [
        { code: 1, name: 'Test7' },
        { code: 2, name: 'Test8' },
      ],
    };
    return of(lookups[key]);
  }
}

describe('LookupPipe', () => {
  let pipe: LookupPipe<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LookupPipe,
        {
          provide: TranslateService,
          useClass: MockTranslateService,
        },
        {
          provide: LookupService,
          useClass: MockLookupService,
        },
        {
          provide: ChangeDetectorRef,
          useClass: MockChangeDetector,
        }
      ],
      declarations: [ LookupPipe ],
    });
  });

  beforeEach(inject([LookupPipe], p => {
      pipe = p;
    })
  );

  it('should transform value by lookupKey', () => {
    expect(pipe.transform(1, 'roles')).toBe('Test1');
    expect(pipe.transform(2, 'roles')).toBe('Test2');
  });

  it('should transform value by lookupKey with custom props', () => {
    expect(pipe.transform(3, 'users', ['customProp', 'customOutput'])).toBe('Test3');
    expect(pipe.transform(4, 'users', ['customProp', 'customOutput'])).toBe('Test4');
  });

  it('should return empty string when value was not found', () => {
    expect(pipe.transform(9999, 'users', ['customProp', 'customOutput'])).toBe('');
  });

  it('should return empty string when no lookupKey or value was provided', () => {
    expect(pipe.transform(3, null)).toBe('');
    expect(pipe.transform(null, 'roles')).toBe('');
  });

  it('should return correct value when lookupKey is changed', () => {
    expect(pipe.transform(1, 'roles')).toBe('Test1');
    expect(pipe.transform(1, 'languages')).toBe('Test7');
  });

  it('should return correct value when lookupProps are changed', () => {
    expect(pipe.transform(1, 'roles')).toBe('Test1');
    expect(pipe.transform(1, 'contractors', ['code', 'output'])).toBe('Test5');
  });

});
