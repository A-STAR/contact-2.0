import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form-control.interface';

import { UserDictionaries2Service } from '../../../../core/user/dictionaries/user-dictionaries-2.service';

import { DynamicFormComponent } from '../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-block-dialog',
  templateUrl: './block-dialog.component.html'
})
export class BlockDialogComponent implements OnInit {
  @Input() dictionaryId: number;
  @Input() titleTranslationKey: string;
  @Input() labelTranslationKey: string;

  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<number>();

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = null;
  data: any;

  constructor(private userDictionariesService: UserDictionaries2Service) {}

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionaryAsOptions(this.dictionaryId)
      .take(1)
      .subscribe(options => {
        this.controls = [
          { label: this.labelTranslationKey, controlName: 'blockReasonCode', type: 'select', required: true, options }
        ];
        this.data = {
          blockReasonCode: options[0].value
        };
      });
  }

  onCloseHandle(): void {
    this.close.emit();
  }

  onSubmitHandle(): void {
    this.action.emit(this.form.value.blockReasonCode);
  }
}
