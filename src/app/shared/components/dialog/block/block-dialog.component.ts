import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form.interface';

import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

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

  constructor(private userDictionariesService: UserDictionariesService) {}

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionaryAsOptions(this.dictionaryId)
      .pipe(first())
      .subscribe(options => {
        this.controls = [
          { label: this.labelTranslationKey, controlName: 'inactiveReasonCode', type: 'select', required: true, options }
        ];
        this.data = {
          inactiveReasonCode: options[0].value
        };
      });
  }

  onCloseHandle(): void {
    this.close.emit();
  }

  onSubmitHandle(): void {
    this.action.emit(this.form.value.inactiveReasonCode);
  }
}
