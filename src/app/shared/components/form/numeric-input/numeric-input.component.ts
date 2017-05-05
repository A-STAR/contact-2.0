import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-input-number',
  templateUrl: './numeric-input.component.html',
  styleUrls: ['./numeric-input.component.scss']
})
export class NumericInputComponent implements OnInit {
  static DECIMAL_SYMBOL = '.';

  @Input() name: string;
  @Input() form: any;

  @Input() scroll = true;
  @Input() step = 1;
  @Input() minValue = 0;
  @Input() maxValue = Infinity;
  @Input() prefix = null;
  @Input() suffix = null;
  @Input() value = 0;
  @Output() valueChange: EventEmitter<number> = new EventEmitter();

  mask = {};

  ngOnInit() {
    const prefix = this.prefix ? this.prefix.replace(NumericInputComponent.DECIMAL_SYMBOL, '') + ' ' : '';
    const suffix = this.suffix ? ' ' + this.suffix.replace(NumericInputComponent.DECIMAL_SYMBOL, '') : '';
    this.mask = {
      mask: createNumberMask({
        prefix,
        suffix,
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ' ',
        allowDecimal: true,
        decimalSymbol: NumericInputComponent.DECIMAL_SYMBOL,
        decimalLimit: 2,
        allowNegative: true
      })
    };
  }

  onValueChange(event: string) {
    const newValue = parseInt(event.replace(/[^\d\.\-]/g, ''), 10);  // See: https://github.com/text-mask/text-mask/issues/109
    this.changeValue(newValue || null);

    // TODO: validate range on user input
  }

  onMouseWheel(event: MouseWheelEvent) {
    if (!this.scroll) {
      return;
    }
    event.preventDefault();
    event.deltaY < 0 ? this.increment() : this.decrement();
  }

  increment() {
    this.changeValue(this.value + this.step);
  }

  decrement() {
    this.changeValue(this.value - this.step);
  }

  private changeValue(value) {
    if (value >= this.minValue && value <= this.maxValue || value === null) {
      this.value = value;
      this.valueChange.emit(value);
    }
  }
}
