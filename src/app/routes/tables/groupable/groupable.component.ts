import { Component, OnInit } from '@angular/core';
import { SelectItem, MultiSelect } from 'primeng/primeng';

import { GridService } from '../../../shared/components/grid/grid.service';

@Component({
  selector: 'app-groupable',
  templateUrl: 'groupable.component.html',
  styleUrls: ['./groupable.component.scss']
})

export class GroupableComponent implements OnInit {

  value: Array<any> = [];
  selected: Array<any> = [];
  totalRecords = 500;
  columns: Array<any> = [
    { field: 'id', header: '#', minWidth: 30, maxWidth: 90, style: { width: '70px' } },
    { field: 'name', header: 'Name', width: 150 },
    { field: 'gender', header: 'Gender', minWidth: 80, maxWidth: 100 },
    { field: 'address.city', header: 'City', minWidth: 200, maxWidth: 200 },
    { field: 'age', header: 'Age', width: 50, maxWidth: 50 },
    // { field: 'address.state', header: 'State', minWidth: 200 },
  ];

  constructor(private gridService: GridService) { }

  ngOnInit() {
    this.gridService
    .read()
      .then(data => {
        this.value = data.slice(0, this.totalRecords);
      });
  }

  calculateGroupAvg(state: string): string {
    const group = this.value.filter(row => row.address.state === state);
    const total = group.reduce((acc, row) => acc + row.age, 0);

    return total ? (total / group.length).toFixed() : '0';
  }

}
