import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { IGridControl } from './excel-filter/excel-filter.interface';

@Injectable()
export class ExcelFilteringService {
  readonly formGroup = this.formBuilder.group({
    filters: this.formBuilder.array([
      this.initFilter(),
    ]),
  });

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  get value(): IGridControl[] {
    return this.formGroup.value.filters.map(f => f.control);
  }

  add(): void {
    this.formGroup.controls['filters']['push'](this.initFilter());
  }

  remove(i: number): void {
    this.formGroup.controls['filters']['removeAt'](i);
  }

  private initFilter(): FormGroup {
    return this.formBuilder.group({
      control: this.formBuilder.control(null),
    });
  }
}
