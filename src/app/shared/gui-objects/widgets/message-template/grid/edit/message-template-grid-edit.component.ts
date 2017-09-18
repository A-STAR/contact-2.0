import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IMessageTemplate } from '../../message-template.interface';

import { MessageTemplateService } from '../../message-template.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../components/form/dynamic-form/dynamic-form.component';

import { makeKey } from '../../../../../../core/utils';

const labelKey = makeKey('widgets.messageTemplate.grid');

@Component({
  selector: 'app-message-template-grid-edit',
  templateUrl: './message-template-grid-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplateGridEditComponent implements OnInit {
  @Input() templateId: number;
  @Input() typeCode: number;

  @Output() submit = new EventEmitter<Partial<IMessageTemplate>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[] = [
    { label: labelKey('name'), controlName: 'name', type: 'text', required: true },
    { label: labelKey('text'), controlName: 'text', type: 'richtexteditor', rows: 10, required: true },
  ];

  template: IMessageTemplate;

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageTemplateService: MessageTemplateService,
    private userDictionariesService: UserDictionariesService,
  ) {}

  ngOnInit(): void {
    this.initControls();
    if (this.templateId) {
      this.messageTemplateService.fetch(this.templateId).subscribe(template => {
        this.template = template;
        this.cdRef.markForCheck();
      });
    }
  }

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  onSubmit(): void {
    this.submit.emit(this.form.requestValue);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private initControls(): void {
    if (this.typeCode === MessageTemplateService.TYPE_SMS) {
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE)
        .subscribe(options => {
          this.controls = [
            ...this.controls,
            { label: labelKey('recipientTypeCode'), controlName: 'recipientTypeCode', type: 'select', options },
            { label: labelKey('isSingleSending'), controlName: 'isSingleSending', type: 'checkbox' },
          ];
        });
    }
  }
}
