import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-ui-multi-select',
  templateUrl: './multi-select.component.html'
})
export class SingleSelectComponent {

  formGroup = new FormGroup({
    select1: new FormControl([1]),
    select2: new FormControl([2, 3]),
    // select3: new FormControl([ { label: 'Absolutely useless assignment, should be noop', value: 1 } ]),
    select3: new FormControl([3]),
    select4: new FormControl({ value: [6, 7], disabled: true }),
  });

  get errors(): any {
    return {
      select2: this.formGroup.get('select2').errors,
    };
  }

  onSelectChange(value: number): void {
    // console.info('select', value);
  }

  disableControl4(): void {
    const ctrl = this.formGroup.get('select4');
    if (ctrl.disabled) {
      ctrl.enable();
    } else {
      ctrl.disable();
    }
  }

  get lookupDisabled(): boolean {
    return this.formGroup.get('select4').disabled;
  }
}
