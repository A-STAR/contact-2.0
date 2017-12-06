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

import { IDynamicFormControl } from '../../../../../components/form/dynamic-form/dynamic-form.interface';
import { IMessageTemplate } from '../../message-template.interface';

import { MessageTemplateService } from '../../message-template.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../../../core/user/permissions/user-permissions.service';

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
    private userPermissionsService: UserPermissionsService,
  ) {}

  ngOnInit(): void {
    this.canEdit$.subscribe(canEdit => this.initControls(canEdit));
    if (this.templateId) {
      this.messageTemplateService.fetch(this.templateId).subscribe(template => {
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
    this.submit.emit(this.form.serializedUpdates);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onInsert(variable: any): void {
    this.control.insert(variable.name);
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
        type: 'richtexteditor',
        onInit: control => this.control = control,
        toolbar: this.requiresRichTextEditor(this.typeCode),
        disabled: !canEdit,
      },
    ] as IDynamicFormControl[];

    if (this.typeCode === MessageTemplateService.TYPE_SMS) {
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
