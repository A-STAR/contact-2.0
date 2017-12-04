import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Calendar } from 'primeng/primeng';

@Component({
  selector: 'app-grid-editor-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent implements AgEditorComponent {
  @ViewChild(Calendar) calendar: Calendar;

  private params: any;
  private value: Date;

  agInit(params: any): void {
    this.value = this.calendar.value;
    this.params = params;
  }

  getValue(): any {
    return this.value;
  }

  isPopup(): boolean {
    return true;
  }

  onValueChange(value: Date): void {
    this.value = value;
    this.params.api.stopEditing();
  }
}
