import { Component, OnInit } from '@angular/core';
import { SelectItem, MultiSelect } from 'primeng/primeng';

import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-sortable',
  templateUrl: 'sortable.component.html',
  styleUrls: ['./sortable.component.scss']
})

export class SortableComponent implements OnInit {
  loading: boolean;
  value: Array<any> = [];
  selected: Array<any> = [];
  totalRecords = 100;
  columns: Array<any> = [
    { field: 'id', header: '#', minWidth: 30, maxWidth: 70, style: { width: '70px' } },
    { field: 'name', header: 'Name', width: 150 },
    { field: 'gender', header: 'Gender', minWidth: 80, maxWidth: 100 },
    { field: 'age', header: 'Age', width: 50, maxWidth: 50 },
    { field: 'address.city', header: 'City', minWidth: 200, maxWidth: 200 },
    { field: 'address.state', header: 'State', minWidth: 200 },
  ];
  columnOptions: SelectItem[] = [];

  constructor(private gridService: GridService) {
    this.columnOptions = this.columns.map(col => {
      return { label: col.header, value: col };
    });
  }

  ngOnInit() {
    this.loading = true;
    this.gridService
      .localRequest()
      .read('assets/server/100k.json')
      .subscribe(
        data => {
          setTimeout(() => {
            this.value = data.slice(0, this.totalRecords);
            this.loading = false;
          }, 2000);
        },
        () => {},
        () => this.loading = false
      );
  }
}
