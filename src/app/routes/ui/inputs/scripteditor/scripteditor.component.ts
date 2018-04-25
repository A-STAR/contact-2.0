import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ContextAutocomplete } from './autocomplete';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-scripteditor',
  templateUrl: './scripteditor.component.html'
})
export class ScriptEditorComponent {
  formGroup = new FormGroup({
    scripteditor: new FormControl(''),
  });

  context = [
    {
      'name': 'debt',
      'desc': 'Долг из контекста выполнения формулы',
      'children': [
        {
          'name': 'debtor',
          'desc': 'Должник текущего долга',
          'children': [
            {
              'name': 'firstName',
              'desc': 'Имя персоны',
              'type': 3
            }
          ]
        },
        {
          'name': 'payments',
          'desc': 'Платежи текущего долга',
          'array': true,
          'children': [
            {
              'name': 'amount',
              'desc': 'Сумма платежа',
              'type': 5
            }
          ]
        }
      ]
    },
    {
      'name': 'user',
      'desc': 'Пользователь из контекста выполнения формулы',
      'children': [
        {
          'name': 'login',
          'desc': 'Имя пользователя',
          'type': 3
        }
      ]
    }
  ];

  options = {
    enableBasicAutocompletion: [ new ContextAutocomplete(this.context) ],
    enableLiveAutocompletion: true,
  };
}
