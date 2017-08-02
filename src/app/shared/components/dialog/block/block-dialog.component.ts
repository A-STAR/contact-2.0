import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';

import { IDynamicFormControl } from '../../../components/form/dynamic-form/dynamic-form-control.interface';

import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-block-dialog',
  templateUrl: './block-dialog.component.html'
})
export class BlockDialogComponent implements OnInit {
  @Input() dictionaryId: number;

  @Output() close = new EventEmitter<void>();
  @Output() action = new EventEmitter<number>();

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormControl> = null;
  data: any;

  constructor(private userDictionariesService: UserDictionariesService) {}

  ngOnInit(): void {
    this.userDictionariesService
      .getDictionaryOptions(this.dictionaryId)
      .take(1)
      .subscribe(options => {
        this.controls = [
          { label: 'dialog.block.blockReasonCode', controlName: 'blockReasonCode', type: 'select', required: true, options }
        ];
        this.data = {
          blockReasonCode: options[0].value
        };
      });

    this.userDictionariesService.preload([ this.dictionaryId ]);
  }

  onCloseHandle(): void {
    this.close.emit();
  }

  onSubmitHandle(): void {
    this.action.emit(this.form.value.blockReasonCode);
  }
}
