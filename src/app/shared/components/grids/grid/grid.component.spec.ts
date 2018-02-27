import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ColDef } from 'ag-grid';
import { AgGridModule } from 'ag-grid-angular/main';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { IGridColumn } from '../grids.interface';

import { GridsService } from '../grids.service';

import { GridToolbarComponent } from '../toolbar/toolbar.component';
import { SimpleGridComponent } from './grid.component';

class TranslateLoaderMock {
  getTranslation(language: string): Observable<any> {
    return of([]);
  }
}

class GridsServiceMock {
  convertColumnsToColDefs<T>(columns: IGridColumn<T>[]): ColDef[] {
    return columns.map(column => ({
      field: column.prop,
      headerName: column.label,
    }));
  }
}

describe('SimpleGridComponent', () => {
  let fixture: ComponentFixture<SimpleGridComponent<any>>;

  beforeEach(Async(() => {
    TestBed
      .configureTestingModule({
        declarations: [
          GridToolbarComponent,
          SimpleGridComponent,
        ],
        imports: [
          AgGridModule.withComponents({}),
          ButtonModule,
          CheckModule,
          FormsModule,
          SelectModule,
          Toolbar2Module,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
        ],
        providers: [
          {
            provide: GridsService,
            useClass: GridsServiceMock,
          }
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGridComponent);
  });

  it('should render empty grid', () => {
    fixture.componentInstance.persistenceKey = 'test-persistence-key';
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
