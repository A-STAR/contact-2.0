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
import { RichTextEditorComponent } from '../../../../../components/form/rich-text-editor/rich-text-editor.component';

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

  controls: IDynamicFormControl[];
  template: IMessageTemplate;

  variables = [];

  private control: RichTextEditorComponent;

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

  onInsert(variable: any): void {
    this.control.insert(variable.name);
  }

  getId = variable => variable.id;

  getName = variable => variable.name;

  private initControls(): void {
    const textControlOptions = this.requiresRichTextEditor(this.typeCode)
      ? { type: 'richtexteditor', onInit: control => this.control = control }
      : { type: 'textarea', rows: 10 };

    this.controls = [
      { label: labelKey('name'), controlName: 'name', type: 'text', required: true },
      { label: labelKey('text'), controlName: 'text', ...textControlOptions, required: true },
    ] as IDynamicFormControl[];

    if (this.typeCode === MessageTemplateService.TYPE_SMS) {
      this.controls = [
        ...this.controls,
        { label: labelKey('recipientTypeCode'), controlName: 'recipientTypeCode', type: 'select', options: [] },
        { label: labelKey('isSingleSending'), controlName: 'isSingleSending', type: 'checkbox' },
      ];
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE)
        .subscribe(options => this.getControl('recipientTypeCode').options = options);

      this.cdRef.detectChanges();
      this.form.onCtrlValueChange('recipientTypeCode').subscribe(v => {
        this.fetchVariables(this.form.requestValue.recipientTypeCode || v);
      });
    } else {
      this.fetchVariables(0);
    }
  }

  private requiresRichTextEditor(typeCode: number): boolean {
    return typeCode === MessageTemplateService.TYPE_AUTO_COMMENT || typeCode === MessageTemplateService.TYPE_PHONE_CALL;
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }

  private fetchVariables(recipientTypeCode: number): void {
    this.messageTemplateService.fetchVariables(this.typeCode, recipientTypeCode).subscribe(data => {
      this.variables = data;
      this.cdRef.markForCheck();
    });
  }
}
