import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { AgGridModule } from 'ag-grid-angular/main';

import { range } from '@app/core/utils/index';

import { SimpleGridComponent } from './grid.component';
import { setTimeout } from 'timers';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

describe('SimpleGridComponent', () => {
  let fixture: ComponentFixture<SimpleGridComponent<any>>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          SimpleGridComponent,
        ],
        imports: [
          AgGridModule.withComponents({}),
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGridComponent);
  });

  it('should render empty grid', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toMatchSnapshot();
  });

  // it('should render grid with columns and rows', done => {
  //   fixture.detectChanges();
  //   fixture.componentInstance.columns = range(1, 10)
  //     .map(i => ({
  //       field: `field-${i}`,
  //       headerName: `Column ${i}`,
  //     }));
  //   fixture.componentInstance.rows = range(1, 100)
  //     .map(i => range(1, 10).reduce((acc, j) => ({
  //       ...acc,
  //       [`field-${j}`]: `${j}-${i}`,
  //     }), {}));
  //   fixture.detectChanges();
  //   expect(fixture.nativeElement).toMatchSnapshot();
  // });
});
