import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first } from 'rxjs/operators';

import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IMessageTemplate } from '../message-templates.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { GridService } from '../../../../shared/components/grid/grid.service';
import { MessageTemplatesService } from '../message-templates.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';
import { UserPermissionsService } from '../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../core/dialog';

import { combineLatestAnd } from '../../../../core/utils/helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-message-template-grid',
  templateUrl: './grid.component.html',
})
export class MessageTemplateGridComponent extends DialogFunctions implements OnInit {
  @Input() typeCode: number;

  selectedTemplateId$ = new BehaviorSubject<number>(null);

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
      enabled: this.userPermissionsService.has('TEMPLATE_ADD'),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      action: () => this.onEdit(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('TEMPLATE_EDIT'),
        this.selectedTemplateId$.map(Boolean)
      ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      action: () => this.onDelete(),
      enabled: combineLatestAnd([
        this.userPermissionsService.has('TEMPLATE_DELETE'),
        this.selectedTemplateId$.map(Boolean)
      ]),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch(),
    }
  ];

  columns: IGridColumn[] = [
    { prop: 'id', maxWidth: 80 },
    { prop: 'name', maxWidth: 240 },
    { prop: 'text' },
  ];

  templates: IMessageTemplate[];

  dialog: 'add' | 'edit' | 'delete';

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
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

  onSelect(template: IMessageTemplate): void {
    this.selectedTemplateId$.next(template.id);
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
        { prop: 'isSingleSending', maxWidth: 150, renderer: 'checkboxRenderer' },
        { prop: 'recipientTypeCode', maxWidth: 100, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
      ];

      this.gridService.setDictionaryRenderers(this.columns)
        .map(columns => this.columns = this.gridService.setRenderers(columns))
        .pipe(first())
        .subscribe();
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
