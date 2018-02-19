import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IUserTerm } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DictRendererComponent } from './dict.component';

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
}

describe('DictRendererComponent', () => {
  let fixture: ComponentFixture<DictRendererComponent>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          DictRendererComponent,
        ],
        providers: [
          {
            provide: UserDictionariesService,
            useClass: UserDictionariesServiceMock,
          }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictRendererComponent);
  });

  it('should render dict renderer', () => {
    fixture.componentInstance.agInit({
      value: 1,
    } as any);
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
