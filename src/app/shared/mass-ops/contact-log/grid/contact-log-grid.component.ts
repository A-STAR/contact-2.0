import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridColumn } from '@app/shared/components/grid2/grid2.interface';
import { IContact } from '../contact-log.interface';

import { ContactLogService } from '../contact-log.service';
import { GridService } from '@app/shared/components/grid/grid.service';

import { Grid2Component } from '@app/shared/components/grid2/grid2.component';

@Component({
  selector: 'app-contact-log-dialog-grid',
  templateUrl: 'contact-log-grid.component.html',
  styleUrls: [ './contact-log-grid.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContactLogGridComponent implements OnInit {
  @Input() personId: number;

  @ViewChild(Grid2Component) grid: Grid2Component;

  private static METADATA_KEY = 'contactSearchContactLog';

  columnIds = [
    'contactDateTime',
    'contactType',
    'contract',
    'createDateTime',
    'debtId',
    'fullName',
    'personRole',
    'resultName',
    'userFullName',
  ];
  data: IContact[];
  rowCount = 0;
  columns$: Observable<IAGridColumn[]>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
    private gridService: GridService,
  ) {}


  ngOnInit(): void {
    this.columns$ = this.gridService.getMetadata(ContactLogGridComponent.METADATA_KEY, {})
        // TODO(i.lobanov): retrieve actions from here when it added in config
        .map(({ columns }) => columns);
  }

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
