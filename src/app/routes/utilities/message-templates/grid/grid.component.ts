import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IMessageTemplate } from '../message-templates.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';
import { IToolbarItem } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ToolbarItemType } from '@app/shared/components/toolbar-2/toolbar-2.interface';
import { ButtonType } from '@app/shared/components/button/button.interface';

import { MessageTemplatesService } from '../message-templates.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { TickRendererComponent } from '@app/shared/components/grids/renderers/tick/tick.component';

import { DialogFunctions } from '@app/core/dialog';
import { HtmlRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel, combineLatestAnd, isEmpty } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-message-template-grid',
  templateUrl: './grid.component.html',
})
export class MessageTemplateGridComponent extends DialogFunctions implements OnInit {
  @Input() typeCode: number;

  selectedTemplateId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.ADD,
      action: () => this.onAdd(),
      enabled: this.userPermissionsService.has('TEMPLATE_ADD'),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('TEMPLATE_EDIT'),
        this.selectedTemplateId$.map(Boolean)
      ]),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.DELETE,
      action: () => this.onDelete(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('TEMPLATE_DELETE'),
        this.selectedTemplateId$.map(Boolean)
      ]),
    },
    {
      type: ToolbarItemType.BUTTON,
      buttonType: ButtonType.REFRESH,
      action: () => this.fetch(),
    }
  ];

  columns: ISimpleGridColumn<IMessageTemplate>[] = [
    { prop: 'id', maxWidth: 80 },
    { prop: 'name', maxWidth: 240 },
    { prop: 'text', renderer: HtmlRendererComponent },
  ].map(addGridLabel('utilities.messageTemplates.grid'));

  templates: IMessageTemplate[];

  dialog: 'add' | 'edit' | 'delete';

  constructor(
    private cdRef: ChangeDetectorRef,
    private messageTemplatesService: MessageTemplatesService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get selectedTemplate$(): Observable<IMessageTemplate> {
    return this.selectedTemplateId$.map(id => (this.templates || []).find(template => template.id === id));
  }

  get selection$(): Observable<IMessageTemplate[]> {
    return this.selectedTemplate$.map(template => template ? [ template ] : []);
  }

  ngOnInit(): void {
    this.initColumns();
    this.fetch();
  }

  onSelect(templates: IMessageTemplate[]): void {
    const templateId = isEmpty(templates)
      ? null
      : templates[0].id;
    this.selectedTemplateId$.next(templateId);
  }

  onDblClick(template: IMessageTemplate): void {
    this.selectedTemplateId$.next(template.id);
    this.onEdit();
  }

  onAdd(): void {
    this.dialog = 'add';
    this.cdRef.markForCheck();
  }

  onEdit(): void {
    this.dialog = 'edit';
    this.cdRef.markForCheck();
  }

  onDelete(): void {
    this.dialog = 'delete';
    this.cdRef.markForCheck();
  }

  onAddDialogSubmit(template: IMessageTemplate): void {
    this.messageTemplatesService.create(template).subscribe(() => this.onSubmitSuccess());
  }

  onEditDialogSubmit(template: IMessageTemplate): void {
    this.messageTemplatesService.update(this.selectedTemplateId$.value, template).subscribe(() => this.onSubmitSuccess());
  }

  onDeleteDialogSubmit(): void {
    this.messageTemplatesService.delete(this.selectedTemplateId$.value).subscribe(() => this.onSubmitSuccess());
  }

  private initColumns(): void {
    if ([ MessageTemplatesService.TYPE_EMAIL, MessageTemplatesService.TYPE_SMS ].includes(this.typeCode)) {
      this.columns = [
        ...this.columns,
        { prop: 'isSingleSending', maxWidth: 150, renderer: TickRendererComponent },
        { prop: 'recipientTypeCode', maxWidth: 100, dictCode: UserDictionariesService.DICTIONARY_MESSAGE_RECIPIENT_TYPE },
      ].map(addGridLabel('utilities.messageTemplates.grid'));
    }
  }

  private onSubmitSuccess(): void {
    this.onCloseDialog();
    this.fetch();
  }

  private fetch(): void {
    this.messageTemplatesService.fetchAll(this.typeCode).subscribe(templates => {
      this.templates = templates;
      if (!templates.find(template => template.id === this.selectedTemplateId$.value)) {
        this.selectedTemplateId$.next(null);
      }
      this.cdRef.markForCheck();
    });
  }
}
