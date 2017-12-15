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
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators/first';

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IMessageTemplate } from '../message-templates.interface';

import { MessageTemplatesService } from '../message-templates.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { TextEditorComponent } from '../../../../shared/components/form/text-editor/text-editor.component';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('utilities.messageTemplates.grid');

@Component({
  selector: 'app-message-template-grid-edit',
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageTemplateGridEditComponent implements OnInit {
  @Input() templateId: number;
  @Input() typeCode: number;

  @Output() submit = new EventEmitter<Partial<IMessageTemplate>>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  /**
   * | Control      | Call | SMS | Email | Autocomment | Custom |
   * | -------------|:----:|:---:|:-----:|:-----------:|:------:|
   * | Name         | +    | +   | +     | +           | +      |
   * | Text         | R    | +   | R, C  | R           | +      |
   * | Recipient    |      | +   | +     |             |        |
   * | Sending Once |      | +   | +     |             |        |
   * | Subject      |      |     | +     |             |        |
   * | Format       |      |     | +     |             |        |
   *
   * R - rich text mode
   * C - code editor mode
   */
  controls: IDynamicFormControl[];
  template: IMessageTemplate;

  variables = [];

  private editor: TextEditorComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageTemplatesService: MessageTemplatesService,
    private userDictionariesService: UserDictionariesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.canEdit$
      .pipe(first())
      .subscribe(canEdit => this.initControls(canEdit));
    if (this.templateId) {
      this.messageTemplatesService.fetch(this.templateId).subscribe(template => {
        this.template = template;
        this.cdRef.markForCheck();
      });
    }
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has('TEMPLATE_EDIT');
  }

  get canSubmit(): boolean {
    return this.form.canSubmit;
  }

  onSubmit(): void {
    this.submit.emit({
      ...(this.templateId ? {} : { typeCode: this.typeCode, recipientTypeCode: 0 }),
      ...this.form.serializedUpdates,
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onInsert(variable: any): void {
    this.editor.insertText(variable.name);
  }

  getId = variable => variable.id;

  getName = variable => variable.userName;

  private initControls(canEdit: boolean): void {
    const { TYPE_EMAIL, TYPE_SMS, TYPE_AUTO_COMMENT, TYPE_PHONE_CALL, TYPE_CUSTOM } = MessageTemplatesService;
    const displayRecipient = [ TYPE_EMAIL, TYPE_SMS ].includes(this.typeCode);
    const richTextMode = [ TYPE_AUTO_COMMENT, TYPE_PHONE_CALL, TYPE_EMAIL ].includes(this.typeCode);
    const isEmail = this.typeCode === TYPE_EMAIL;

    this.controls = [
      {
        controlName: 'name',
        required: true,
        type: 'text',
      },
      {
        controlName: 'subject',
        display: isEmail,
        required: true,
        type: 'text',
      },
      {
        controlName: 'format',
        dictCode: UserDictionariesService.DICTIONARY_EMAIL_FORMAT,
        display: isEmail,
        required: true,
        type: 'selectwrapper',
      },
      {
        controlName: 'text',
        onInit: editor => this.editor = editor,
        required: true,
        codeMode: isEmail,
        richTextMode,
        type: 'texteditor',
      },
      {
        controlName: 'recipientTypeCode',
        dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE,
        display: displayRecipient,
        type: 'selectwrapper',
      },
      {
        controlName: 'isSingleSending',
        display: displayRecipient,
        type: 'checkbox',
      },
    ].map(control => ({ ...control, disabled: !canEdit, label: labelKey(control.controlName) })) as IDynamicFormControl[];

    if (displayRecipient) {
      // Detecting changes, otherwise `this.form` will be undefined in `onCtrlValueChange`
      this.cdRef.detectChanges();
      this.form
        .onCtrlValueChange('recipientTypeCode')
        .subscribe(value => this.fetchVariables(this.form.serializedUpdates.recipientTypeCode || value));
    } else {
      this.fetchVariables(0);
    }
  }

  private fetchVariables(recipientTypeCode: number): void {
    this.messageTemplatesService.fetchVariables(this.typeCode, recipientTypeCode).subscribe(data => {
      this.variables = data;
      this.cdRef.markForCheck();
    });
  }
}
