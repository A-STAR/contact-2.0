import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-textarea',
  templateUrl: './textarea.component.html'
})
export class TextareaComponent {
  formGroup = new FormGroup({
    textarea1: new FormControl(''),
    textarea2: new FormControl('Hi there!\nI am a textarea.'),
    textarea3: new FormControl('Hi there!\nI am a textarea.'),
    textarea4: new FormControl('Hi there!\nI am a textarea.\nIt\'s good to have you here.\nYou\'re a nice person.'),
    textarea5: new FormControl('Hi there!\nI am a textarea.'),
    textarea6: new FormControl(''),
    textarea7: new FormControl({ value: 'Hi there!\nI am a textarea.', disabled: true }),
  });

  get errors(): any {
    return {
      textarea6: this.formGroup.get('textarea6').errors;
    };
  }
}
