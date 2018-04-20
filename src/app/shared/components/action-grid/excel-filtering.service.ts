import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';

import { IGridControl } from './excel-filter/excel-filter.interface';
import { GuidControlState } from './excel-filter/guid-control/guid-control.component';

const validator: ValidatorFn = control => {
  return control.value && control.value.state === GuidControlState.READY
    ? null
    : { required: true };
};

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
    const filter = this.initFilter();
    this.filtersArray.push(filter);
  }

  remove(i: number): void {
    this.filtersArray.removeAt(i);
  }

  clear(): void {
    this.formGroup.reset();
    for (let i = 0; i < this.filtersArray.length; i++) {
      this.remove(i);
    }
    this.add();
  }

  private get filtersArray(): FormArray {
    return this.formGroup.get('filters') as FormArray;
  }

  private initFilter(): FormGroup {
    return this.formBuilder.group({
      control: this.formBuilder.control(null, validator),
    });
  }
}
