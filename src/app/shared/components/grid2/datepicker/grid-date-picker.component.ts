import { Component } from '@angular/core';
import { IDateParams } from 'ag-grid/main';
import { IDateAngularComp } from 'ag-grid-angular/main';

@Component({
  selector: 'app-grid-date-picker',
  templateUrl: './grid-date-picker.component.html',
  styleUrls: [ './grid-date-picker.component.scss' ]
})
export class GridDatePickerComponent implements IDateAngularComp {
  private date: Date;
  private dateParams: IDateParams;

  agInit(dateParams: IDateParams): void {
    this.dateParams = dateParams;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    this.date = date;
  }

  update(date: Date): void {
    this.setDate(date);
    this.dateParams.onDateChanged();
  }
}
