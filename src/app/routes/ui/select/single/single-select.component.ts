import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-single-select',
  templateUrl: './single-select.component.html'
})
export class SingleSelectComponent {

  select2Model = 1;

  formGroup = new FormGroup({
    select1: new FormControl({ value: 1, disabled: false }),
    select2: new FormControl([ { label: 'No effect here, array is a wrong input format', value: 'bogus' } ]),
    select3: new FormControl(1),
    select4: new FormControl(3),
    select5: new FormControl({ value: 1, disabled: true }),
  });

  get errors(): any {
    return {
      select2: this.formGroup.get('select2').errors,
    };
  }

}
