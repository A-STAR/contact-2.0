import { Component, OnInit } from '@angular/core';
import { SelectItem, MultiSelect } from 'primeng/primeng';

import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-reorderable',
  templateUrl: 'reorderable.component.html',
  styleUrls: ['./reorderable.component.scss']
})

export class ReorderableComponent implements OnInit {

  value: Array<any> = [];
  selected: Array<any> = [];
  totalRecords = 50;
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
    const options = this.columns.map(v => ({ label: v.header, value: v }));
    this.columnOptions.concat(options);
  }

  ngOnInit() {
    this.gridService
      .read()
      .then(data => {
        this.value = data.slice(0, this.totalRecords);
      });
  }
}
