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

import { IDynamicFormControl } from '../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IMessageTemplate } from '../message-templates.interface';

import { MessageTemplatesService } from '../message-templates.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { TextEditorComponent } from '../../../../shared/components/form/text-editor/text-editor.component';

import { makeKey } from '../../../../core/utils';

const labelKey = makeKey('widgets.messageTemplate.grid');

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
    this.canEdit$.subscribe(canEdit => this.initControls(canEdit));
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
    this.controls = [
      {
        label: labelKey('name'),
        controlName: 'name',
        type: 'text',
        required: true,
        disabled: !canEdit,
      },
      {
        label: labelKey('text'),
        controlName: 'text',
        required: true,
        type: 'texteditor',
        onInit: editor => this.editor = editor,
        richTextMode: this.requiresRichTextEditor(this.typeCode),
        disabled: !canEdit,
      },
    ] as IDynamicFormControl[];

    if (this.typeCode === MessageTemplatesService.TYPE_SMS) {
      this.controls = [
        ...this.controls,
        {
          label: labelKey('recipientTypeCode'),
          controlName: 'recipientTypeCode',
          type: 'select',
          options: [],
          disabled: !canEdit
        },
        {
          label: labelKey('isSingleSending'),
          controlName: 'isSingleSending',
          type: 'checkbox',
          disabled: !canEdit
        },
      ];
      this.userDictionariesService.getDictionaryAsOptions(UserDictionariesService.DICTIONARY_PERSON_ROLE)
        .subscribe(options => this.getControl('recipientTypeCode').options = options);

      this.cdRef.detectChanges();
      this.form.onCtrlValueChange('recipientTypeCode').subscribe(value => {
        this.fetchVariables(this.form.serializedUpdates.recipientTypeCode || value);
      });
    } else {
      this.fetchVariables(0);
    }
  }

  private requiresRichTextEditor(typeCode: number): boolean {
    return typeCode === MessageTemplatesService.TYPE_AUTO_COMMENT || typeCode === MessageTemplatesService.TYPE_PHONE_CALL;
  }

  private getControl(controlName: string): IDynamicFormControl {
    return this.controls.find(control => control.controlName === controlName);
  }

  private fetchVariables(recipientTypeCode: number): void {
    this.messageTemplatesService.fetchVariables(this.typeCode, recipientTypeCode).subscribe(data => {
      this.variables = data;
      this.cdRef.markForCheck();
    });
  }
}
