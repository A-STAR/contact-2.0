import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { UserDictionariesService } from '../../../../../../../../core/user/dictionaries/user-dictionaries.service'
import { UserPermissionsService } from '../../../../../../../../core/user/permissions/user-permissions.service'

import { UserPermissions } from '../../../../../../../../core/user/permissions/user-permissions';

@Component({
  selector: 'app-debt-grid-status-dialog',
  templateUrl: './debt-grid-status-dialog.component.html'
})
export class DebtGridStatusDialogComponent {
  @Output() close = new EventEmitter<void>();

  controls;
  data = {};

  constructor(
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    Observable.combineLatest(
      this.userDictionariesService.getDictionariesAsOptions([
        UserDictionariesService.DICTIONARY_DEBT_STATUS,
        UserDictionariesService.DICTIONARY_REASON_FOR_STATUS_CHANGE,
      ]),
      this.userPermissionsService.bag(),
    ).subscribe(([options, bag]) => {
      this.controls = this.buildControls(bag);
    });
  }

  onSubmit(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(bag: UserPermissions): Array<any> {
    return [
      {
        label: 'statusCode',
        type: 'radio',
        radioOptions: [
          {
            label: 'Перевод в статус "Проблемные"',
            value: 9,
            disabled: bag.contains('DEBT_STATUS_EDIT_LIST', 9)
          },
          {
            label: 'Перевод в статус "Поиск информации"',
            value: 12,
            disabled: bag.contains('DEBT_STATUS_EDIT_LIST', 12)
          },
          {
            label: 'Перевод в статус "Без перспектив"',
            value: 15,
            disabled: bag.contains('DEBT_STATUS_EDIT_LIST', 15)
          },
          {
            label: 'Перевод в пользовательский статус',
            value: null,
            disabled: bag.containsCustom('DEBT_STATUS_EDIT_LIST')
          }
        ]
      },
      {
        label: 'reasonCode',
        type: 'select',
        options: ''
      }
    ];
  }
}
