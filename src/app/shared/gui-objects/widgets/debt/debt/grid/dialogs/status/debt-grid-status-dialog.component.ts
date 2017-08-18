import { Component, EventEmitter, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { UserConstantsService } from '../../../../../../../../core/user/constants/user-constants.service';
import { UserDictionariesService } from '../../../../../../../../core/user/dictionaries/user-dictionaries.service'
import { UserPermissionsService } from '../../../../../../../../core/user/permissions/user-permissions.service'

import { UserPermissions } from '../../../../../../../../core/user/permissions/user-permissions';

@Component({
  selector: 'app-debt-grid-status-dialog',
  templateUrl: './debt-grid-status-dialog.component.html'
})
export class DebtGridStatusDialogComponent {
  @Output() close = new EventEmitter<void>();

  private code$ = new BehaviorSubject<number>(null);

  group$;

  constructor(
    private userConstantsService: UserConstantsService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    this.group$ = Observable.combineLatest(
      this.userDictionariesService.getDictionaries([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
      ]),
      this.userPermissionsService.bag(),
      this.userConstantsService.get('Debt.StatusReason.MandatoryList'),
      this.code$,
    ).map(([ dictionaries, bag, reasonRequired, code ]) => {
      console.log(dictionaries);
      console.log(code);
      console.log(reasonRequired);
      return {
        type: 'group',
        name: 'rootGroup',
        children: [
          {
            name: 'code',
            type: 'radio',
            required: true,
            options: [
              {
                label: 'Перевод в статус "Проблемные"',
                value: 9,
                disabled: !bag.contains('DEBT_STATUS_EDIT_LIST', 9)
              },
              {
                label: 'Перевод в статус "Поиск информации"',
                value: 12,
                disabled: !bag.contains('DEBT_STATUS_EDIT_LIST', 12)
              },
              {
                label: 'Перевод в статус "Без перспектив"',
                value: 15,
                disabled: !bag.contains('DEBT_STATUS_EDIT_LIST', 15)
              },
              {
                label: 'Перевод в пользовательский статус',
                value: 0,
                disabled: !bag.containsCustom('DEBT_STATUS_EDIT_LIST')
              },
            ],
            onChange: value => this.code$.next(value)
          },
          {
            name: 'reasonCode',
            type: 'select',
            options: dictionaries[UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE]
              .filter(option => option.parentCode === code)
              .map(term => ({ value: term.code, label: term.name })),
            required: reasonRequired.valueS === 'ALL' || reasonRequired.valueS.split(',').map(Number).includes(code)
          },
          {
            name: 'statusCode',
            type: 'select',
            options: dictionaries[UserDictionariesService.DICTIONARY_DEBT_STATUS]
              .filter(term => term.code >= 20000)
              .map(term => ({ value: term.code, label: term.name })),
            required: code === 0,
            display: code === 0
          },
          {
            name: 'comment',
            type: 'textarea'
          }
        ]
      };
    });
  }

  get value$(): any {
    return this.code$.map(code => ({ code }));
  }

  onSubmit(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
