import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-text',
  templateUrl: './text.component.html'
})
export class TextComponent {
  formGroup = new FormGroup({
    text1: new FormControl(''),
    text2: new FormControl('I am a text field'),
    text3: new FormControl(''),
    text4: new FormControl(''),
    text5: new FormControl({ value: 'I am a text field', disabled: true }),
  });

  get errors(): any {
    return {
      text3: this.formGroup.get('text3').errors,
      text4: this.formGroup.get('text4').errors,
    };
  }
}
