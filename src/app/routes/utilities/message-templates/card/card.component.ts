import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators/first';

import {
  IDynamicFormControl,
  IDynamicFormRichTextControl
} from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
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
export class MessageTemplateGridEditComponent implements OnInit, OnDestroy {
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

  private formatCodeSubscription: Subscription;
  private recipientTypeCodeSubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageTemplatesService: MessageTemplatesService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.canEdit$
      .pipe(first())
      .subscribe(canEdit => this.initControls(canEdit));
    if (this.templateId) {
      this.messageTemplatesService.fetch(this.templateId).subscribe(template => {
        if (this.typeCode === MessageTemplatesService.TYPE_EMAIL) {
          this.template = {
            ...template,
            formatCode: template.formatCode || 1,
          };
        } else {
          this.template = template;
        }
        this.cdRef.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.formatCodeSubscription) {
      this.formatCodeSubscription.unsubscribe();
    }
    if (this.recipientTypeCodeSubscription) {
      this.recipientTypeCodeSubscription.unsubscribe();
    }
  }

  get title(): string {
    const mode = this.templateId ? 'edit' : 'add';
    return `utilities.messageTemplates.dialogs.${mode}.title`;
  }

  get canEdit$(): Observable<boolean> {
    return this.userPermissionsService.has(this.templateId ? 'TEMPLATE_EDIT' : 'TEMPLATE_ADD');
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
    const { TYPE_EMAIL, TYPE_SMS, TYPE_AUTO_COMMENT, TYPE_PHONE_CALL } = MessageTemplatesService;
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
        required: isEmail,
        type: 'text',
      },
      {
        controlName: 'formatCode',
        dictCode: UserDictionariesService.DICTIONARY_EMAIL_FORMAT,
        display: isEmail,
        required: isEmail,
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

    // Detecting changes, otherwise `this.form` will be undefined in `onCtrlValueChange`
    this.cdRef.detectChanges();

    if (isEmail) {
      this.formatCodeSubscription = this.form
        .onCtrlValueChange('formatCode')
        .subscribe(value => {
          const formatCode = Array.isArray(value) ? value[0].value : value;
          const ctrl = this.controls
            .find(control => control.controlName === 'text');
          (<IDynamicFormRichTextControl>ctrl).richTextMode = formatCode === 1;
        });
    }

    if (displayRecipient) {
      this.recipientTypeCodeSubscription = this.form
        .onCtrlValueChange('recipientTypeCode')
        .subscribe(value => this.fetchVariables(this.form.serializedUpdates.recipientTypeCode || value));
    } else {
      this.fetchVariables(0);
    }

    this.cdRef.markForCheck();
  }

  private fetchVariables(recipientTypeCode: number): void {
    this.messageTemplatesService.fetchVariables(this.typeCode, recipientTypeCode).subscribe(data => {
      this.variables = data;
      this.cdRef.markForCheck();
    });
  }
}
