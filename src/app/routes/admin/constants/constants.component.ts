import { Component, ViewChild, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { IDataSource } from '../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { GridComponent } from '../../../shared/components/grid/grid.component';
import { TranslatorService } from '../../../core/translator/translator.service';

@Component({
  selector: 'app-constants',
  templateUrl: './constants.component.html'
})
export class ConstantsComponent implements OnInit {
  @ViewChild(GridComponent) grid: GridComponent;

  currentConstant: any = null;
  subscription: any = null;

  tabs: Array<any> = [
    { id: 0, title: 'Константы', active: true },
  ];

  columns: Array<any> = [
    { name: 'Ид', prop: 'id', minWidth: 30, maxWidth: 70, disabled: true },
    { name: 'Название константы', prop: 'name', maxWidth: 350 },
    { name: 'Значение', prop: 'value', minWidth: 100, maxWidth: 150 },
    { name: 'Комментарий', prop: 'dsc', width: 200, minWidth: 400 },
  ];

  controls: Array<IDynamicFormControl> = [];

  dataSource: IDataSource = {
    read: '/api/constants',
    update: '/api/constants/{id}',
    dataKey: 'constants',
  };

  parseFn = (data) => {
    const { dataKey } = this.dataSource;
    const dataSet = data[dataKey];

    return !dataSet
      ? []
      : dataSet.map(val => {
        switch (val.typeCode) {
          case 1:
            val.value = String(val.valueN);
            break;
          case 2:
            val.value = this.datePipe.transform(new Date(val.valueD), 'dd.MM.yyyy HH:mm:ss');
            break;
          case 3:
            val.value = val.valueS || '';
            break;
          case 4:
            val.value = Boolean(val.valueB) ? 'Истина' : 'Ложь';
            break;
          default:
            val.value = '';
        }
        return val;
      });
  }

  constructor(private datePipe: DatePipe, private translatorService: TranslatorService) { }

  ngOnInit(): void {
    this.translateComponent();
  }

  onTabClose(id: number): void {
    this.tabs = this.tabs.filter((tab, tabId) => tabId !== id);
  }

  onEdit(record: any): void {
    this.currentConstant = record;
  }

  onCancel(): void {
    this.currentConstant = null;
  }

  onUpdate(): void {
    this.grid.load().subscribe();
  }

  translateComponent(): void {
    this.subscription = this.translatorService
      .onLangChange()
      .subscribe(event => {
        const { constants } = event.translations;
        const { grid, form } = constants;
        this.columns = this.columns.map(col => {
          col.name = grid[col.prop];
          return col;
        });
        this.tabs[0].title = form.title;
      });
  }

}
