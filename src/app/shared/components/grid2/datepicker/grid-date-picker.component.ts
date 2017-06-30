import { Component } from '@angular/core';
import { IDateParams } from 'ag-grid/main';
import { IDateAngularComp } from 'ag-grid-angular/main';

@Component({
  selector: 'app-grid-date-picker',
  templateUrl: './grid-date-picker.component.html'
})
export class GridDatePickerComponent implements IDateAngularComp {
  date: Date;

  private dateParams: IDateParams;

  agInit(dateParams: IDateParams): void {
    this.dateParams = dateParams;
  }

  getDate(): Date {
    return this.date;
  }

  setDate(date: Date): void {
    if (Number(this.date) !== Number(date)) {
      this.date = date;
      this.dateParams.onDateChanged();
    }
  }
}
