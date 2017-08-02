import { Component, EventEmitter, Output, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form-control.interface';

import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-address-grid-block-dialog',
  templateUrl: './block-dialog.component.html'
})
export class AddressGridBlockDialogComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<number>();

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = null;
  data: any;

  constructor(private userDictionariesService: UserDictionariesService) {
    this.userDictionariesService
      .getDictionaryOptions(UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING)
      .take(1)
      .subscribe(options => {
        this.controls = [
          {
            label: 'widgets.address.dialogs.block.blockReasonCode',
            controlName: 'blockReasonCode',
            type: 'select',
            required: true,
            options
          }
        ];
        this.data = {
          blockReasonCode: options[0].value
        };
      });

    userDictionariesService.preload([ UserDictionariesService.DICTIONARY_ADDRESS_REASON_FOR_BLOCKING ]);
  }

  onCloseHandle(): void {
    this.onClose.emit();
  }

  onSubmitHandle(): void {
    this.onSubmit.emit(this.form.value.blockReasonCode);
  }
}
