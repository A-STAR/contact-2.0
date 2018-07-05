import { async as Async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ColDef, MenuItemDef } from 'ag-grid';
import { AgGridModule } from 'ag-grid-angular/main';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { IGridColumn } from '../grids.interface';
import { IContextMenuOptions, IContextMenuSimpleOptions } from '@app/shared/components/grids/context-menu/context-menu.interface';

import { ContextMenuService } from '../context-menu/context-menu.service';
import { GridsDefaultsService } from '@app/shared/components/grids/grids-defaults.service';
import { GridsService } from '../grids.service';
import { SettingsService } from '@app/core/settings/settings.service';

import { GridToolbarComponent } from '../toolbar/toolbar.component';
import { SimpleGridComponent } from './grid.component';
import { Router, ActivationEnd, ActivatedRouteSnapshot } from '@angular/router';

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

class GridsDefaultsServiceMock {
  reset(gridApi: any, columnApi: any): void {
    ///
  }
}

class SettingsServiceMock {
  onClear$ =  of(false);
}

class ContextMenuServiceMock {
  translateNameAndShortcut(key: string, defaultValue: string): string {
    return defaultValue;
  }

  onCtxMenuClick(options: IContextMenuOptions, simpleOptions: IContextMenuSimpleOptions): Array<string | MenuItemDef> {
    return [];
  }
}

class MockRouter {
  events = of(new ActivationEnd(new ActivatedRouteSnapshot()));
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
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          {
            provide: GridsService,
            useClass: GridsServiceMock,
          },
          {
            provide: ContextMenuService,
            useClass: ContextMenuServiceMock,
          },
          {
            provide: SettingsService,
            useClass: SettingsServiceMock,
          },
          {
            provide: GridsDefaultsService,
            useClass: GridsDefaultsServiceMock,
          },
        ]
      })
      .overrideComponent(SimpleGridComponent, {
        set: {
          providers: [
            {
              provide: GridsDefaultsService,
              useClass: GridsDefaultsServiceMock,
            },
            {
              provide: Router,
              useClass: MockRouter,
            }
          ]
        }
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
