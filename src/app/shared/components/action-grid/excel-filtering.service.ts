import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

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

  clear(): void {
    this.formGroup.reset();
    for (let i = 0; i < this.filtersArray.length; i++) {
      this.remove(i);
    }
    this.add();
  }

  private get filtersArray(): FormArray {
    return this.formGroup.controls['filters'] as FormArray;
  }

  private initFilter(): FormGroup {
    return this.formBuilder.group({
      control: this.formBuilder.control(null),
    });
  }
}
