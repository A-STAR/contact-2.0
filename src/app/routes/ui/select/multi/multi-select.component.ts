import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-multi-select',
  templateUrl: './multi-select.component.html'
})
export class SingleSelectComponent {

  select1Model = [1, 3];
  select2Model = [1, 2];
  select3Model = [2];
  select4Model = [3];

  formGroup = new FormGroup({
    select1: new FormControl(''),
    select2: new FormControl([ { label: 'No effect here', value: 0 } ]),
    select3: new FormControl([ { label: 'Absolutely useless assignment', value: 1 } ]),
    select4: new FormControl(3),
  });

  get errors(): any {
    return {
      select1: this.formGroup.get('select1').errors,
      select2: this.formGroup.get('select2').errors,
      select3: this.formGroup.get('select3').errors,
    };
  }

  onSingleSelect1Change(value: number): void {
    // console.log('select1', value);
  }
}
