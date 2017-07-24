import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-qbuilder2-input',
  templateUrl: './qbuilder2-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QBuilder2InputComponent {
  @Input() value: number | string | Date;
  @Input() filterType: string;
  @Output() onChange = new EventEmitter<number | string | Date>();

  constructor(private valueConverterService: ValueConverterService) {}

  onValueChange(event: Event): void {
    this.onChange.emit((event.target as HTMLInputElement).value);
  }

  onSetValueChange(options: Array<{ value: string }>): void {
    this.onChange.emit(options[0].value);
  }

  onDateValueChange(date: Date): void {
    this.onChange.emit(this.valueConverterService.toISO(date));
  }

  toDate(date: string): Date {
    return this.valueConverterService.fromISO(date);
  }
}
