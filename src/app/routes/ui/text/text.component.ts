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
    text3: new FormControl({ value: 'I am a text field', disabled: true }),
  });
}
