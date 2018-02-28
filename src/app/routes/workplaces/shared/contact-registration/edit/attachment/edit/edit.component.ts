import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';

import { IUserConstant } from '@app/core/user/constants/user-constants.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '@app/core/utils';
import { maxFileSize } from '@app/core/validators';

const labelKey = makeKey('workplaces.shared.contactRegistration.edit.form.attachments.add.form');

@Component({
  selector: 'app-contact-registration-attachment-edit',
  templateUrl: './edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttachmentEditComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private userConstantsService: UserConstantsService,
  ) {}

  ngOnInit(): void {
    this.userConstantsService.get('FileAttachment.MaxSize')
      .pipe(first())
      .subscribe(maxSize => {
        this.controls = this.buildControls(maxSize);
        this.cdRef.markForCheck();
      });
  }

  onSubmit(): void {
    this.submit.emit(this.form.serializedUpdates);
  }

  onClose(): void {
    this.close.emit();
  }

  private buildControls(maxSize: IUserConstant): IDynamicFormControl[] {
    return [
      {
        label: labelKey('docTypeCode'),
        controlName: 'docTypeCode',
        type: 'select',
        dictCode: UserDictionariesService.DICTIONARY_DOCUMENT_TYPE,
      },
      {
        label: labelKey('docName'),
        controlName: 'docName',
        type: 'text',
      },
      {
        label: labelKey('docNumber'),
        controlName: 'docNumber',
        type: 'text',
      },
      {
        label: labelKey('comment'),
        controlName: 'comment',
        type: 'textarea',
      },
      {
        label: labelKey('file'),
        controlName: 'file',
        type: 'file',
        validators: [ maxFileSize(1e3 * maxSize.valueN) ],
      },
    ];
  }
}
