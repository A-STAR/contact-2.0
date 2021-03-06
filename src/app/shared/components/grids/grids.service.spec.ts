import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IUserDictionaries } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { GridsService } from './grids.service';
import { TranslateService } from '@ngx-translate/core';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { SettingsService } from '@app/core/settings/settings.service';

class MockSettingsService {
  private storage = new Map<string, any>();

  set(key: string, value: any): void {
    this.storage.set(key, value);
  }

  get(key: string): any {
    return this.storage.get(key);
  }
}

class MockTranslateService {
  instant(key: string | Array<string>, interpolateParams?: Object): string | any {
    return '';
  }
}

class MockUserDictionariesService {
  getDictionaries(ids: Array<number>): Observable<IUserDictionaries> {
    return of({});
  }
}

describe('GridsService', () => {
  let service: GridsService;
  let settingsService: SettingsService;
  let translateService: TranslateService;
  let userDictionariesService: UserDictionariesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GridsService,
        {
          provide: SettingsService,
          useClass: MockSettingsService,
        },
        {
          provide: TranslateService,
          useClass: MockTranslateService,
        },
        {
          provide: UserDictionariesService,
          useClass: MockUserDictionariesService,
        },
      ],
    });
    service = TestBed.get(GridsService);
    settingsService = TestBed.get(SettingsService);
    translateService = TestBed.get(TranslateService);
    userDictionariesService = TestBed.get(UserDictionariesService);
    // TODO(i.lobanov): to prevent tslint complains, will be actually used in tests later
    settingsService.get('');
    translateService.instant('');
    userDictionariesService.getDictionaries([1]);
  });

  it('should initialize', () => {
    expect(service).toBeDefined();
  });

  it('should convert data tree', () => {
    const data = [
      {
        code: 2,
        name: 'Поддерево',
        mandatory: 0,
        children: [
          {
            code: 3,
            name: 'Атрибут_type_2',
            mandatory: 0,
            typeCode: 2,
            valueD: '2017-06-20T21:00:00Z',
            children: [
              {
                code: 3,
                name: 'Nested_Attribute',
                mandatory: 0,
                typeCode: 2,
              }
            ]
          },
          {
            code: 4,
            name: 'Атрибут_type_3',
            mandatory: 0,
            typeCode: 3,
            valueS: 'test_data_49',
            children: []
          }
        ]
      },
      {
        code: 7,
        name: 'Атрибут_type_6',
        mandatory: 0,
        typeCode: 6,
        valueN: 2,
        dictNameCode: 20001,
        children: []
      }
    ];
    const result = [
      {
        code: 2,
        name: 'Поддерево',
        mandatory: 0,
        path: ['Поддерево']
      },
      {
        code: 3,
        name: 'Атрибут_type_2',
        mandatory: 0,
        typeCode: 2,
        valueD: '2017-06-20T21:00:00Z',
        path: ['Поддерево', 'Атрибут_type_2']
      },
      {
        code: 3,
        name: 'Nested_Attribute',
        mandatory: 0,
        typeCode: 2,
        path: ['Поддерево', 'Атрибут_type_2', 'Nested_Attribute']
      },
      {
        code: 4,
        name: 'Атрибут_type_3',
        mandatory: 0,
        typeCode: 3,
        valueS: 'test_data_49',
        path: ['Поддерево', 'Атрибут_type_3']
      },
      {
        code: 7,
        name: 'Атрибут_type_6',
        mandatory: 0,
        typeCode: 6,
        valueN: 2,
        dictNameCode: 20001,
        path: ['Атрибут_type_6']
      }
    ];
    expect(service.convertTreeData(data)).toEqual(result);
  });

});
