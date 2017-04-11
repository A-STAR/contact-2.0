import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { TableData } from './ngxdatatable.data';

@Component({
    selector: 'app-datatable',
    templateUrl: './ngxdatatable.component.html',
    styleUrls: ['./ngxdatatable.component.scss']
})
export class NgxDatatableComponent implements OnInit {

    rows: Array<any> = [];
    selected: Array<any> = [];

    constructor(private http: Http) {

        http.get('assets/server/datatable.json')
            .subscribe((data) => {
                setTimeout(() => {
                    this.rows = data.json();
                }, 1000);
            });
    }

    private sortByWordLength = (a: any) => {
        return a.name.length;
    }

    public removeItem(item: any) {
        this.rows = this.rows.filter((elem) => elem !== item);
        console.log('Remove: ', item.email);
    }

    public columns: Array<any> = [
      { prop: 'name' },
      { name: 'City' },
      { name: 'Age' },
      { name: 'Email' },
      { name: 'RegDate' },
    ];

    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '' },
        className: ['table-striped', 'table-bordered', 'mb0', 'd-table-fixed'] // mb0=remove margin -/- .d-table-fixed=fix column width
    };

    public ngOnInit(): void {
        // this.onChangeTable(this.config);
    }

    public onCellClick(data: any): any {
        console.log(data);
    }

    public getRowHeight(row): number {
      return row.height;
    }

}
