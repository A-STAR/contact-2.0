import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { IAGridResponse } from 'app/shared/components/grid2/grid2.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { ContactSelectService } from '../contact-select.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { Grid2Component } from '../../../../../shared/components/grid2/grid2.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-contact-registration-contact-select-search',
  styleUrls: [ 'contact-select-search.component.scss' ],
  templateUrl: 'contact-select-search.component.html',
})
export class ContactSelectSearchComponent {
  @ViewChild(Grid2Component) grid: Grid2Component;

  columns$ = this.gridService.getColumns([
    { dataType: 1, name: 'id' },
    { dataType: 1, name: 'lastName' },
    { dataType: 1, name: 'firstName' },
    { dataType: 1, name: 'middleName' },
    { dataType: 1, name: 'birthDate' },
    { dataType: 1, name: 'passportNumber' },
    { dataType: 6, name: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER },
  ].map(column => ({ ...column, label: column.name })), {});

  rows: any[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactSelectService: ContactSelectService,
    private gridService: GridService,
  ) {}

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.contactSelectService
      .fetchAllPersons(filters, params)
      .subscribe((response: IAGridResponse<any>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }
}
