import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-multi-select',
  templateUrl: './multi-select.component.html'
})
export class SingleSelectComponent {

  // select1Model = [1, 3];
  select2Model = [1, 2];

  formGroup = new FormGroup({
    select1: new FormControl([1]),
    select2: new FormControl({ value: [1] }),
    select3: new FormControl([ { label: 'Absolutely useless assignment', value: 1 } ]),
    select4: new FormControl({ value: [3], disabled: true }),
  });

  get errors(): any {
    return {
      select1: this.formGroup.get('select1').errors,
      select2: this.formGroup.get('select2').errors,
      select3: this.formGroup.get('select3').errors,
    };
  }

  onSelectChange(value: number): void {
    // console.info('select', value);
  }
}
