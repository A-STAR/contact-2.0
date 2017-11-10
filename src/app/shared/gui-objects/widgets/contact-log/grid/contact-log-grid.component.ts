import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';

import { IContact } from '../contact-log.interface';

import { ContactLogService } from '../contact-log.service';

import { Grid2Component } from '../../../../components/grid2/grid2.component';

@Component({
  selector: 'app-contact-log-grid',
  templateUrl: 'contact-log-grid.component.html',
  styleUrls: [ './contact-log-grid.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContactLogGridComponent {
  @Input() personId: number;

  @ViewChild(Grid2Component) grid: Grid2Component;

  columnIds = [
    'contactDateTime',
    'contactType',
    'сontract',
    'createDateTime',
    'debtId',
    'fullName',
    'personRole',
    'resultName',
    'userFullName',
  ];
  data: IContact[];
  rowCount = 0;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
  ) {}

  onRequest(): void {
    if (this.personId) {
      const filters = this.grid.getFilters();
      const params = this.grid.getRequestParams();
      this.contactLogService.fetchAll(this.personId, filters, params)
        .subscribe(response => {
          this.data = [ ...response.data ];
          this.rowCount = response.total;
          this.cdRef.markForCheck();
        });
    }
  }
}