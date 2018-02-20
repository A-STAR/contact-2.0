import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { DateComponent } from '@app/shared/components/form/datetime/date/date.component';

@Component({
  selector: 'app-grid-editor-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent implements AgEditorComponent {
  @ViewChild(DateComponent) calendar: DateComponent;

  private params: any;

  value: Date;

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
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
